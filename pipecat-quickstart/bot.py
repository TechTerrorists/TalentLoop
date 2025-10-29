#
# Copyright (c) 2024–2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

"""Pipecat + Tavus AI Interviewer Bot.

This bot runs a voice-based AI interviewer pipeline using:
- Deepgram (Speech-to-Text)
- Gemini (LLM)
- Cartesia (Text-to-Speech)
- Tavus (Avatar Transport, with video stream into Pipecat dashboard)
- Daily (fallback transport if Tavus is disabled)

Run:
    uv run bot.py
"""

import os
import aiohttp
from dotenv import load_dotenv
from loguru import logger

# --- Load models ---
print("🚀 Starting Pipecat bot...")
print("⏳ Loading models and imports (20 seconds, first run only)\n")

logger.info("Loading Local Smart Turn Analyzer V3...")
from pipecat.audio.turn.smart_turn.local_smart_turn_v3 import LocalSmartTurnAnalyzerV3

logger.info("✅ Local Smart Turn Analyzer V3 loaded")
logger.info("Loading Silero VAD model...")
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams

logger.info("✅ Silero VAD model loaded")

from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.processors.frameworks.rtvi import RTVIConfig, RTVIObserver, RTVIProcessor
from pipecat.runner.types import RunnerArguments
from pipecat.runner.utils import create_transport
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.google.llm import GoogleLLMService
from pipecat.transports.base_transport import BaseTransport, TransportParams
from pipecat.transports.daily.transport import DailyParams
from pipecat.transports.tavus.transport import TavusTransport, TavusParams

logger.info("✅ All pipeline components loaded successfully!")

load_dotenv(override=True)


# ------------------------ RAG Context Fetcher ------------------------

async def fetch_rag_context(query: str) -> str:
    """Fetch relevant context from your FastAPI RAG service."""
    rag_url = os.getenv("RAG_API_URL", "http://127.0.0.1:8001/get_context")
    if not rag_url:
        return ""

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(rag_url, params={"query": query, "limit": 3}) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    contents = [r.get("content", "") for r in data.get("results", [])]
                    return "\n\n".join(contents)
    except Exception as e:
        logger.error(f"[RAG fetch failed] {e}")
    return ""


# ------------------------ Main Bot Logic ------------------------

async def run_bot(transport: BaseTransport, runner_args: RunnerArguments):
    logger.info("🎙️ Starting Interviewer Bot Pipeline")

    # Core services
    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))
    tts = CartesiaTTSService(
        api_key=os.getenv("CARTESIA_API_KEY"),
        voice_id="71a7ad14-091c-4e8e-a314-022ece01c121",  # British Reading Lady
    )
    llm = GoogleLLMService(api_key=os.getenv("GOOGLE_API_KEY"), model="gemini-2.5-flash")

    # Conversation memory
    messages = [{"role": "system", "content": "You are an AI interviewer. Waiting for context..."}]
    context = LLMContext(messages)
    context_aggregator = LLMContextAggregatorPair(context)
    rtvi = RTVIProcessor(config=RTVIConfig(config=[]))

    # Build Pipecat pipeline
    pipeline = Pipeline(
        [
            transport.input(),
            rtvi,
            stt,
            context_aggregator.user(),
            llm,
            tts,
            transport.output(),
            context_aggregator.assistant(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(enable_metrics=True, enable_usage_metrics=True),
        observers=[RTVIObserver(rtvi)],
    )

    # --- Client connect handler ---
    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info("🟢 Client connected")

        candidate_name = os.getenv("INTERVIEW_CANDIDATE_NAME", "John Doe")
        company_name = os.getenv("INTERVIEW_COMPANY_NAME", "StartupXYZ")
        job_title = os.getenv("INTERVIEW_JOB_TITLE", "Full Stack Developer")

        query = (
            f"Relevant interview context for candidate '{candidate_name}' applying for "
            f"'{job_title}' at '{company_name}'. Include resume, job description, and company details."
        )
        rag_context = await fetch_rag_context(query)

        system_prompt = f"""
        You are an AI interviewer for {company_name}, conducting a technical interview for a {job_title} role.
        Use this context to guide your questions and tone:
        {rag_context}

        Start politely, greet {candidate_name}, and ask one question at a time.
        """

        messages.clear()
        messages.append({"role": "system", "content": system_prompt})
        await task.queue_frames([LLMRunFrame()])

    # --- Client disconnect handler ---
    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("🔴 Client disconnected")
        logger.info(f"🗒️ Transcript: {messages}")
        await task.cancel()

    # --- Run pipeline ---
    runner = PipelineRunner(handle_sigint=runner_args.handle_sigint)
    await runner.run(task)


# ------------------------ Transport Setup ------------------------

async def bot(runner_args: RunnerArguments):
    """Main bot entry point."""
    use_tavus = os.getenv("USE_TAVUS", "true").lower() == "true"

    if use_tavus:
        logger.info("🎥 Initializing Tavus transport...")
        async with aiohttp.ClientSession() as session:
            transport = TavusTransport(
                bot_name="Pipecat AI Interviewer",
                api_key=os.getenv("TAVUS_API_KEY"),
                replica_id=os.getenv("TAVUS_REPLICA_ID"),
                session=session,
                params=TavusParams(
                    audio_in_enabled=True,
                    audio_out_enabled=True,
                    video_out_enabled=True,  # 👈 Enables Tavus video feed into dashboard
                    microphone_out_enabled=False,
                    vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.3)),
                    turn_analyzer=LocalSmartTurnAnalyzerV3(),
                ),
            )

            # When video frame received, it's automatically handled by Pipecat dashboard.
            @transport.event_handler("video_frame")
            async def on_video_frame(frame):
                pass

            logger.success("✅ TavusTransport active — avatar video will appear in dashboard.")
            await run_bot(transport, runner_args)

    else:
        logger.info("🎧 Using Daily Transport (no video avatar).")
        transport_params = {
            "daily": lambda: DailyParams(
                audio_in_enabled=True,
                audio_out_enabled=True,
                vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.3)),
                turn_analyzer=LocalSmartTurnAnalyzerV3(),
            ),
        }
        transport = await create_transport(runner_args, transport_params)
        await run_bot(transport, runner_args)


# ------------------------ Entrypoint ------------------------

if __name__ == "__main__":
    from pipecat.runner.run import main
    main()
