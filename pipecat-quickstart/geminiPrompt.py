import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()


GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

with open("trialTranscript.txt", "r") as file:
    transcript = file.read()
    response = model.generate_content(f"You are an interview evaluator. You need to evaluate an interviewee on the basis of the transcript generated. Context - {transcript}")
    print(response.text)
