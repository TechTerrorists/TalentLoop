#
# Copyright (c) 2024–2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

"""Pipecat Quickstart Example.

The example runs a simple voice AI bot that you can connect to using your
browser and speak with it. You can also deploy this bot to Pipecat Cloud.

Required AI services:
- Deepgram (Speech-to-Text)
- OpenAI (LLM)
- Cartesia (Text-to-Speech)

Run the bot using::

    uv run bot.py
"""

import os
import aiohttp
from dotenv import load_dotenv
from loguru import logger

print("🚀 Starting Pipecat bot...")
print("⏳ Loading models and imports (20 seconds, first run only)\n")

logger.info("Loading Local Smart Turn Analyzer V3...")
from pipecat.audio.turn.smart_turn.local_smart_turn_v3 import LocalSmartTurnAnalyzerV3

logger.info("✅ Local Smart Turn Analyzer V3 loaded")
logger.info("Loading Silero VAD model...")
from pipecat.audio.vad.silero import SileroVADAnalyzer

logger.info("✅ Silero VAD model loaded")

from pipecat.audio.vad.vad_analyzer import VADParams
from pipecat.frames.frames import LLMRunFrame

logger.info("Loading pipeline components...")
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

logger.info("✅ All components loaded successfully!")

load_dotenv(override=True)

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
        print(f"[RAG fetch failed] {e}")
    return ""


async def run_bot(transport: BaseTransport, runner_args: RunnerArguments):
    logger.info(f"Starting bot")

    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))

    tts = CartesiaTTSService(
        api_key=os.getenv("CARTESIA_API_KEY"),
        voice_id="71a7ad14-091c-4e8e-a314-022ece01c121",  # British Reading Lady
    )

    llm = GoogleLLMService(
        api_key=os.getenv("GOOGLE_API_KEY"),
        model="gemini-2.5-flash"
    )
#     candidate_name = "John Doe"
#     company_name = "StartupXYZ"
#     job_title = "Full Stack Developer"

#     query = f"""
#     Relevant interview context for candidate '{candidate_name}' applying for '{job_title}' at '{company_name}'.
#     Include details from the candidate's resume, job description, company profile, and any relevant skills or requirements.
#     """
#     rag_context = await fetch_rag_context(query)
    messages = [
        {
            "role": "system",
            "content": "You are an AI interviewer. Waiting for interview context..."
        }
    ]

    context = LLMContext(messages)
    context_aggregator = LLMContextAggregatorPair(context)

    rtvi = RTVIProcessor(config=RTVIConfig(config=[]))

    pipeline = Pipeline(
        [
            transport.input(),  # Transport user input
            rtvi,  # RTVI processor
            stt,
            context_aggregator.user(),  # User responses
            llm,  # LLM
            tts,  # TTS
            transport.output(),  # Transport bot output
            context_aggregator.assistant(),  # Assistant spoken responses
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
        observers=[RTVIObserver(rtvi)],
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info(f"Client connected")
        
        candidate_name = os.getenv("INTERVIEW_CANDIDATE_NAME", "John Doe")
        company_name = os.getenv("INTERVIEW_COMPANY_NAME", "StartupXYZ")
        job_title = os.getenv("INTERVIEW_JOB_TITLE", "Full Stack Developer")

        # Fetch RAG context dynamically
        query = f"""
        Relevant interview context for candidate '{candidate_name}' applying for '{job_title}' at '{company_name}'.
        Include details from the candidate's resume, job description, company profile, and any relevant skills or requirements.
        """
        rag_context = await fetch_rag_context(query)

        # Set system prompt with fetched context
        system_prompt = f"""
        You are an AI interviewer for {company_name}, conducting a technical interview for a {job_title} position.
        Use the following context to guide your questions:

        {rag_context}

        Greet the candidate {candidate_name} and begin the interview politely. Ask one question at a time.
        """
        messages.clear()
        messages.append({"role": "system", "content": system_prompt})
        await task.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info(f"Client disconnected")
        # Save interview transcript to backend
        logger.info(f"Interview transcript: {messages}")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=runner_args.handle_sigint)

    await runner.run(task)


async def bot(runner_args: RunnerArguments):
    """Main bot entry point for the bot starter."""

    transport_params = {
        "daily": lambda: DailyParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
            turn_analyzer=LocalSmartTurnAnalyzerV3(),
        ),
        "webrtc": lambda: TransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
            turn_analyzer=LocalSmartTurnAnalyzerV3(),
        ),
    }

    transport = await create_transport(runner_args, transport_params)

    await run_bot(transport, runner_args)


if __name__ == "__main__":
    from pipecat.runner.run import main

    main()
