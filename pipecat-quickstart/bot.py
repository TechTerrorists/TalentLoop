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
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI
from supabase import create_client, Client
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase: Client = None
if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)


# app = FastAPI()
# app.include_router(jobskillsroute.router, candidateroute.router)

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
from pipecat.services.tavus.video import TavusVideoService
from pipecat.transports.base_transport import BaseTransport, TransportParams
from pipecat.transports.daily.transport import DailyParams
from pipecat.processors.transcript_processor import TranscriptProcessor
from pipecat.frames.frames import LLMRunFrame, TranscriptionMessage, TranscriptionUpdateFrame

logger.info("✅ All components loaded successfully!")

load_dotenv(override=True)


class TranscriptHandler:
    """Handles real-time transcript processing and output.

    Maintains a list of conversation messages and outputs them either to a log
    or to a file as they are received. Each message includes its timestamp and role.

    Attributes:
        messages: List of all processed transcript messages
        output_file: Optional path to file where transcript is saved. If None, outputs to log only.
    """

    def __init__(self, output_file: Optional[str] = None):
        """Initialize handler with optional file output.

        Args:
            output_file: Path to output file. If None, outputs to log only.
        """
        self.messages: List[TranscriptionMessage] = []
        self.output_file: Optional[str] = output_file
        logger.debug(
            f"TranscriptHandler initialized {'with output_file=' + output_file if output_file else 'with log output only'}"
        )

    async def save_message(self, message: TranscriptionMessage):
        """Save a single transcript message.

        Outputs the message to the log and optionally to a file.

        Args:
            message: The message to save
        """
        timestamp = f"[{message.timestamp}] " if message.timestamp else ""
        line = f"{timestamp}{message.role}: {message.content}"
        print(line)

        # Always log the message
        logger.info(f"Transcript: {line}")

        # Optionally write to file
        if self.output_file:
            try:
                with open(self.output_file, "a", encoding="utf-8") as f:
                    f.write(line + "\n")
            except Exception as e:
                logger.error(f"Error saving transcript message to file: {e}")

    async def on_transcript_update(
        self, processor: TranscriptProcessor, frame: TranscriptionUpdateFrame
    ):
        """Handle new transcript messages.

        Args:
            processor: The TranscriptProcessor that emitted the update
            frame: TranscriptionUpdateFrame containing new messages
        """
        logger.debug(f"Received transcript update with {len(frame.messages)} new messages")

        for msg in frame.messages:
            self.messages.append(msg)
            await self.save_message(msg)

async def getdetails(candidateid):
    try:
            candidatedetails=supabase.table("Candidate_Info").select("*").eq("id",candidateid).execute()
            companyid=candidatedetails.data[0]["company_id"]
            jobid=candidatedetails.data[0]["jobid"]
            companydetails=supabase.table("Company").select("*").eq("_id",companyid).execute()
            # jobdetails=supabase.table("Candidate_Info").select("*,Job_Requirements(*)").eq("_id",jobid).execute()
            # jobdetails2 = supabase.table("Job_Requirements").select("*,Job_Requirements(*)").eq("job_id",jobid).execute()
            jobdetails=supabase.table("Job").select("*,Job_Requirements(*)").eq("_id",jobid).execute()
            
            jobTitle = jobdetails.data[0]["title"]
            jobRequirements = jobdetails.data[0]["Job_Requirements"]
            companyName = companydetails.data[0]['name']
            candidateName = candidatedetails.data[0]['name']
            skills = ""
            for i in jobRequirements:
                skill = i['skill']
                skills += skill + ", "

            return f"Candidate Name - {candidateName}, Job title - {jobTitle}, Job Requirements - {jobRequirements}, Company Name - {companyName}, Required skillset to be interviewed on - {skills}"

            
    except Exception as e:
        logger.error(f"Error fetching job skills: {e}")
        return ""


async def run_bot(transport: BaseTransport, runner_args: RunnerArguments):
    logger.info(f"Starting bot")
    
    async with aiohttp.ClientSession() as session:
        stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))

        tts = CartesiaTTSService(
            api_key=os.getenv("CARTESIA_API_KEY"),
            voice_id="71a7ad14-091c-4e8e-a314-022ece01c121",
        )

        llm = GoogleLLMService(
            api_key=os.getenv("GOOGLE_API_KEY"),
            model="gemini-2.5-flash"
        )

        @llm.event_handler("on_llm_response")
        async def on_llm_response(llm, response):
            msg = TranscriptionMessage(
                role="assistant",
                content=response.text,
                timestamp=datetime.utcnow().isoformat()
    )

        tavus = TavusVideoService(
            api_key=os.getenv("TAVUS_API_KEY"),
            replica_id=os.getenv("TAVUS_REPLICA_ID"),
            session=session,
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

        transcript = TranscriptProcessor()
        transcript_handler = TranscriptHandler(output_file="trialTranscript.txt")

        rtvi = RTVIProcessor(config=RTVIConfig(config=[]))

        pipeline = Pipeline(
            [
                transport.input(),
                rtvi,
                stt,
                transcript.user(),
                context_aggregator.user(),
                llm,
                tts,
                tavus,
                transport.output(),
                transcript.assistant(),
                context_aggregator.assistant(),
            ]
        )

        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                audio_in_sample_rate=16000,
                audio_out_sample_rate=24000,
                enable_metrics=True,
                enable_usage_metrics=True,
            ),
            observers=[RTVIObserver(rtvi)],
        )

        @transport.event_handler("on_client_connected")
        async def on_client_connected(transport, client):
            logger.info(f"Client connected")
            
            # Clear transcript file for new interview
            try:
                with open('trialTranscript.txt', 'w', encoding='utf-8') as f:
                    f.write('')
            except Exception as e:
                logger.error(f"Failed to clear transcript file: {e}")
            
            # candidate_name = os.getenv("INTERVIEW_CANDIDATE_NAME", "John Doe")
            # company_name = os.getenv("INTERVIEW_COMPANY_NAME", "StartupXYZ")
            # job_title = os.getenv("INTERVIEW_JOB_TITLE", "Full Stack Developer")
            candidate_id = int(os.getenv("CANDIDATE_ID", "2"))

            # Fetch job skills
            relevantContext = await getdetails(candidateid=candidate_id)

            # Set system prompt with job skills
            system_prompt = f"""
            You are an AI interviewer , conducting a technical interview for  position.
            All required relevant context is provided below:
                {relevantContext}
            
            Greet the candidate with their name and begin the interview politely. Focus your questions on the required skills listed above. Ask one question at a time. Also ask counter questions and questions from their profile.

            """
            messages.clear()
            messages.append({"role": "system", "content": system_prompt})
            await task.queue_frames([LLMRunFrame()])

        @transcript.event_handler("on_transcript_update")
        async def on_transcript_update(processor, frame):
            await transcript_handler.on_transcript_update(processor, frame)

        @transport.event_handler("on_client_disconnected")
        async def on_client_disconnected(transport, client):
            logger.info(f"Client disconnected")
            logger.info(f"Interview transcript: {messages}")
            
            # Upload transcript and end interview
            try:
                with open('trialTranscript.txt', 'r', encoding='utf-8') as f:
                    transcript_content = f.read()
                
                interview_id = int(os.getenv("INTERVIEW_ID", "87"))
                
                # Upload transcript
                supabase.table('transcripts').insert({
                    'interview_id': interview_id,
                    'transcript_data': transcript_content
                }).execute()
                
                # End interview in database
                supabase.table('interview').update({
                    'status': 'completed'
                }).eq('id', interview_id).execute()
                
                logger.info(f"Interview {interview_id} completed and transcript uploaded")
            except Exception as e:
                logger.error(f"Failed to complete interview: {e}")
            
            await task.cancel()

        runner = PipelineRunner(handle_sigint=runner_args.handle_sigint)

        await runner.run(task)


async def bot(runner_args: RunnerArguments):
    """Main bot entry point for the bot starter."""

    transport_params = {
        "daily": lambda: DailyParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            video_out_enabled=True,
            video_out_is_live=True,
            video_out_width=1280,
            video_out_height=720,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
            turn_analyzer=LocalSmartTurnAnalyzerV3(),
        ),
        "webrtc": lambda: TransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            video_out_enabled=True,
            video_out_is_live=True,
            video_out_width=1280,
            video_out_height=720,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
            turn_analyzer=LocalSmartTurnAnalyzerV3(),
        ),
    }

    transport = await create_transport(runner_args, transport_params)

    await run_bot(transport, runner_args)


if __name__ == "__main__":
    from pipecat.runner.run import main

    main()
