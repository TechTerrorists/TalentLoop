import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client


class InterviewEvaluator:
    def __init__(self):
        load_dotenv()

        # --------------------------
        # ENV + SUPABASE
        # --------------------------
        self.SUPABASE_URL = os.getenv("SUPABASE_URL")
        self.SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.SUPABASE_URL, self.SUPABASE_KEY)

        # --------------------------
        # GOOGLE GEMINI CONFIG
        # --------------------------
        self.GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=self.GOOGLE_API_KEY)

        self.schema = {
            "type": "object",
            "properties": {
                "Overall Score": {"type": "number"},
                "Communication": {"type": "number"},
                "Professionalism": {"type": "number"},
                "Positive Attitude": {"type": "number"},
                "Technical Depth": {"type": "number"},
                "Response Quality": {"type": "number"},
                "Recommendation": {
                    "type": "string",
                    "enum": ["Hire", "Maybe", "Reject"]
                },
                "Key Strengths": {"type": "array", "items": {"type": "string"}},
                "Areas for Improvement": {"type": "array", "items": {"type": "string"}},
                "Evidence": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "quote": {"type": "string"},
                            "category": {"type": "string"}
                        },
                        "required": ["quote", "category"]
                    }
                }
            },
            "required": [
                "Overall Score", "Communication", "Professionalism",
                "Positive Attitude", "Technical Depth", "Response Quality",
                "Recommendation", "Key Strengths", "Areas for Improvement", "Evidence"
            ]
        }

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": self.schema
            }
        )

    # ------------------------------------------
    # 1️⃣ Load transcript text
    # ------------------------------------------
    def load_transcript(self, filepath: str) -> str:
        with open(filepath, "r", encoding="utf-8") as file:
            return file.read()

    # ------------------------------------------
    # 2️⃣ Get JSON result from Gemini
    # ------------------------------------------
    def evaluate(self, transcript: str) -> dict:
        prompt = (
            f"You are an interview evaluator. Evaluate candidate based on transcript.\n\n"
            f"Context:\n{transcript}\n\n"
            f"Return a JSON object with numeric scores (0–100), recommendation, strengths, "
            f"improvement areas, and evidence quotes."
        )

        MAX_RETRIES = 3
        for attempt in range(1, MAX_RETRIES + 1):
            print(f"\n🔄 Attempt {attempt}/{MAX_RETRIES} ...")
            response = self.model.generate_content(prompt)

            if response.text and response.text.strip():
                try:
                    return json.loads(response.text.strip())
                except json.JSONDecodeError:
                    cleaned = response.text.replace("```json", "").replace("```", "").strip()
                    return json.loads(cleaned)

            time.sleep(1)

        raise Exception("❌ Gemini failed to return valid JSON after retries.")

    # ------------------------------------------
    # 3️⃣ Insert into Supabase
    # ------------------------------------------
    def save_to_supabase(self, data: dict, transcript: str, interviewID: int):
        row = {
            "interview_id": interviewID,
            "overallscore": data.get("Overall Score"),
            "communication": data.get("Communication"),
            "professionalism": data.get("Professionalism"),
            "positiveAttitude": data.get("Positive Attitude"),
            "technicalDepth": data.get("Technical Depth"),
            "responseQuality": data.get("Response Quality"),
            "recommendation": data.get("Recommendation"),
            "areasOfImprovement": ", ".join(data.get("Areas for Improvement", [])),
            "keyStrengths": data.get("Key Strengths", []),
            "evidence": data.get("Evidence", []),
            "transcripturl": transcript  # TODO → replace with actual storage URL
        }

        result = self.supabase.table("Report").insert(row).execute()
        return result

    # ------------------------------------------
    # 4️⃣ Full pipeline runner
    # ------------------------------------------
    def run(self, transcript_path: str, interviewID: int = 0):
        transcript = self.load_transcript(transcript_path)

        print("\n📌 Generating evaluation from Gemini...")
        data = self.evaluate(transcript)

        print("\n✅ GEMINI JSON:")
        print(json.dumps(data, indent=2))

        print("\n📩 Inserting into Supabase...")
        result = self.save_to_supabase(data, transcript, interviewID)

        print("\n✅ SUPABASE RESPONSE:")
        print(result)
        return result


# -------------------------------
# ✅ Example usage
# -------------------------------
if __name__ == "__main__":
    evaluator = InterviewEvaluator()
    evaluator.run("trialTranscript.txt", interviewID=112)
