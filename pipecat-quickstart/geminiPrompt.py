import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()


GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

with open("trialTranscript.txt", "r") as file:
    transcript = file.read()
    response = model.generate_content(f"""You are an interview evaluator. You need to evaluate an interviewee on the basis of the transcript generated. Context - {transcript}
                                        Return a JSON object with the following structure:
                                        Overall Score — Composite performance (0–100)

                                        Communication — Clarity & articulation of answers

                                        Professionalism — Tone, language, role fit

                                        Positive Attitude — Enthusiasm and growth mindset

                                        Technical Depth — Correctness & depth of technical reasoning

                                        Response Quality — Depth · Clarity · Relevance

                                        Recommendation — Hire / Maybe / Reject (with reason)

                                        Key Strengths — Top positive traits found

                                        Areas for Improvement — Priority suggestions for growth

                                        Evidence — Transcript quotes supporting each score""")
    print(type(response.text))
