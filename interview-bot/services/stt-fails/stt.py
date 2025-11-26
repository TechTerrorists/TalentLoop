import torch
import sounddevice as sd
import numpy as np
from deepgram import DeepgramClient
from deepgram.core.events import EventType
from loguru import logger

# --- Config ---
DEEPGRAM_API_KEY = "29734ff47e4b93dfeef326579a2ee7095abe57fa"
SAMPLE_RATE = 16000
CHANNELS = 1
CHUNK_DURATION = 0.5  # seconds per audio chunk
OUTPUT_FILE = "transcripts.txt"  # file to store transcripts

# --- Load Silero VAD ---
vad_model, utils = torch.hub.load(
    repo_or_dir='snakers4/silero-vad',
    model='silero_vad',
    force_reload=False,
    onnx=False
)
get_speech_timestamps = utils[0]

# --- Initialize Deepgram client ---
client = DeepgramClient(api_key=DEEPGRAM_API_KEY)

def append_to_file(text: str):
    """Append transcript to a file."""
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(text + "\n")

def start_stream():
    """Start microphone -> VAD -> Deepgram streaming."""

    with client.listen.v2.connect(
        model="flux-general-en",
        encoding="linear16",
        sample_rate=SAMPLE_RATE
    ) as connection:

        # --- Message handler ---
        def on_message(event):
            if hasattr(event, "channel") and event.channel.alternatives:
                transcript = event.channel.alternatives[0].transcript
                if transcript:
                    append_to_file(transcript)  # store instead of printing

        connection.on(EventType.MESSAGE, on_message)
        connection.on(EventType.OPEN, lambda _: logger.info("Deepgram connection opened"))
        connection.on(EventType.ERROR, lambda err: logger.error(f"Deepgram error: {err}"))
        connection.on(EventType.CLOSE, lambda _: logger.info("Deepgram connection closed"))

        connection.start_listening()
        logger.info("Deepgram listening started. Streaming mic audio...")

        try:
            with sd.RawInputStream(samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='int16') as stream:
                while True:
                    data = stream.read(int(SAMPLE_RATE * CHUNK_DURATION))[0]
                    pcm = np.frombuffer(data, dtype=np.int16)

                    # Run VAD
                    timestamps = get_speech_timestamps(pcm, vad_model, sampling_rate=SAMPLE_RATE)
                    chunks = [pcm[ts['start']:ts['end']].tobytes() for ts in timestamps]

                    if chunks:
                        connection.send_media(b"".join(chunks))

        except KeyboardInterrupt:
            logger.info("Stopping mic streaming")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")

if __name__ == "__main__":
    start_stream()
