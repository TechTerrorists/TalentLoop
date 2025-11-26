import os
import asyncio
from deepgram import DeepgramClient, LiveTranscriptionEvents, LiveTranscriptionOptions, Microphone


class DeepgramSTT:
    def __init__(self, on_transcript=None):
        self.api_key = "29734ff47e4b93dfeef326579a2ee7095abe57fa"
        if not self.api_key:
            raise RuntimeError("DEEPGRAM_API_KEY not set")

        self.client = DeepgramClient(self.api_key)
        self.on_transcript = on_transcript
        self.live = None

    async def start_listening(self):
        print("🎤 Starting Deepgram STT (SDK v5)...")

        # Create live transcription connection
        self.live = self.client.listen.live.v("1")

        # Handle incoming transcripts
        @self.live.on(LiveTranscriptionEvents.Transcript)
        async def handle_transcript(self, result, **kwargs):
            try:
                channel = result.channel
                alt = channel.alternatives[0]
                text = alt.transcript.strip()
                if text and self.on_transcript:
                    self.on_transcript(text)
            except Exception as e:
                print("❌ Transcript error:", e)

        # Configure options
        options = LiveTranscriptionOptions(
            model="nova-2",
            smart_format=True,
            interim_results=True,
            punctuate=True,
            encoding="linear16",
            sample_rate=16000
        )

        # Start WebSocket connection
        await self.live.start(options)

        # Start microphone capture
        mic = Microphone(sample_rate=16000)

        mic.start(lambda data: self.live.send(data))

        print("🎙️ Listening... Press CTRL+C to stop")

        try:
            while True:
                await asyncio.sleep(0.1)
        except KeyboardInterrupt:
            print("🛑 Stopping Deepgram...")
        finally:
            mic.finish()
            await self.live.finish()

from services.deepgram_stt import DeepgramSTT
def handle_text(text):
    print("USER SAID:", text)

async def main():
    stt = DeepgramSTT(on_transcript=handle_text)
    await stt.start_listening()

asyncio.run(main())