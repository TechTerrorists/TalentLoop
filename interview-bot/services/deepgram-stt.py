from deepgram import DeepgramClient
from deepgram.core.events import EventType
import sounddevice as sd
import threading
import numpy as np

DEEPGRAM_API_KEY = "29734ff47e4b93dfeef326579a2ee7095abe57fa"
client = DeepgramClient(api_key=DEEPGRAM_API_KEY)

with client.listen.v2.connect(
    model="flux-general-en",
    encoding="linear16",
    sample_rate=16000,
) as connection:
    ready = threading.Event()
    
    def on_message(result):
        event = getattr(result, "event", None)
        turn_index = getattr(result, "turn_index", None)
        eot_confidence = getattr(result, "end_of_turn_confidence", None)
        if event == "StartOfTurn":
            print(f"--- StartOfTurn (Turn {turn_index}) ---")
        transcript = getattr(result, "transcript", None)
        if transcript:
            print(transcript)
        if event == "EndOfTurn":
            print(f"--- EndOfTurn (Turn {turn_index}, Confidence: {eot_confidence}) ---")
    
    connection.on(EventType.OPEN, lambda _: ready.set())
    connection.on(EventType.MESSAGE, on_message)

    # Function to capture audio from the default mic
    def stream_mic():
        ready.wait()
        def callback(indata, frames, time, status):
            # Convert float32 input to int16 PCM
            pcm_data = (indata * 32767).astype(np.int16).tobytes()
            connection.send_media(pcm_data)
        
        # Start streaming from default mic
        with sd.InputStream(samplerate=16000, channels=1, dtype='float32', callback=callback):
            threading.Event().wait()  # Keep thread alive
    
    threading.Thread(target=stream_mic, daemon=True).start()
    
    print("Transcribing your microphone in real-time...")
    connection.start_listening()
