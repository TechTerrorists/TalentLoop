import os
from cartesia import Cartesia
import pyaudio

client = Cartesia(api_key="sk_car_bxxmcxMMEZwNYzzQYiTiKV")
ws = client.tts.websocket()

# Set up PyAudio for playback
p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=44100, output=True)

# Stream and play audio chunks
for chunk in ws.send(
    model_id="sonic-3",
    transcript="Hello, My name is John Doe. I am excited to be here today to discuss the opportunities and challenges in the tech industry. Thank you for having me.",
    voice={"mode": "id", "id": "f9836c6e-a0bd-460e-9d3c-f7299fa60f94"},
    output_format={"container": "raw", "encoding": "pcm_s16le", "sample_rate": 44100}
):
    stream.write(chunk.audio)

stream.close()
p.terminate()