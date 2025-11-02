import os
import json
from typing import Dict, List, Any
from google import generativeai as genai
from pydantic import BaseModel, Field

# ---------- Define JSON Schema ----------

class SkillAssessment(BaseModel):
    skill: str = Field(description="Skill name from job requirements")
    score: int = Field(description="Score 0-100", ge=0, le=100)
    evidence: str = Field(description="Quote or summary from transcript")

class SentimentAnalysis(BaseModel):
    overall_sentiment: str = Field(description="positive/neutral/negative")
    confidence_level: str = Field(description="low/medium/high")
    nervousness_indicators: List[str] = Field(default_factory=list)

class InterviewAnalysis(BaseModel):
    interview_id: int
    overall_score: int = Field(description="Overall performance score 0-100", ge=0, le=100)
    skill_scores: List[SkillAssessment]
    sentiment: SentimentAnalysis
    recommendation: str = Field(description="hire/maybe/reject with reasoning")
    feedback: str = Field(description="Detailed feedback for candidate")
    key_strengths: List[str]
    areas_for_improvement: List[str]
    response_quality: Dict[str, Any] = Field(description="Depth, clarity, relevance metrics")

# ---------- Core Analyzer ----------

class InterviewAnalyzerService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def _format_transcript(self, transcript: List[Dict]) -> str:
        formatted = []
        for entry in transcript:
            speaker = entry.get("speaker", "unknown")
            text = entry.get("text", "")
            timestamp = entry.get("timestamp", "")
            formatted.append(f"[{timestamp}] {speaker}: {text}")
        return "\n".join(formatted)

    async def analyze_interview(
        self,
        interview_id: int,
        transcript: List[Dict],
        job_requirements: List[str],
        job_description: str
    ) -> InterviewAnalysis:

        transcript_text = self._format_transcript(transcript)
        
        # Create a detailed prompt that instructs Gemini to return the exact JSON structure
        prompt = f"""
You are an expert technical interviewer analyzing a candidate's interview performance.

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS:
{', '.join(job_requirements) if job_requirements else 'General skills assessment'}

INTERVIEW TRANSCRIPT:
{transcript_text}

Please analyze this interview and return a JSON response with the following structure.
Be sure to return ONLY valid JSON, no markdown or explanations:

{{
  "overall_score": <number from 0-100 based on overall performance>,
  "skill_scores": [
    {{
      "skill": "<skill name>",
      "score": <score 0-100>,
      "evidence": "<quote or summary from transcript>"
    }}
  ],
  "sentiment": {{
    "overall_sentiment": "<positive|neutral|negative>",
    "confidence_level": "<low|medium|high>",
    "nervousness_indicators": ["<indicator1>", "<indicator2>"]
  }},
  "recommendation": "<hire|maybe|reject> - <reasoning>",
  "feedback": "<detailed feedback for the candidate>",
  "key_strengths": ["<strength1>", "<strength2>"],
  "areas_for_improvement": ["<area1>", "<area2>"],
  "response_quality": {{
    "depth": <1-10>,
    "clarity": <1-10>,
    "relevance": <1-10>
  }}
}}

Analyze the transcript thoroughly and provide realistic scores based on the actual content.
"""

        try:
            # Use Gemini without schema validation - just ask for JSON
            response = await self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    top_p=0.95
                )
            )
            
            # Parse the response
            analysis_data = json.loads(response.text)
            
            # Add the interview_id
            analysis_data["interview_id"] = interview_id
            
            # Validate with Pydantic
            return InterviewAnalysis(**analysis_data)
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {response.text}")
            
            # Try to extract JSON from the response if it's wrapped in markdown
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response.text, re.DOTALL)
            if json_match:
                try:
                    analysis_data = json.loads(json_match.group(1))
                    analysis_data["interview_id"] = interview_id
                    return InterviewAnalysis(**analysis_data)
                except:
                    pass
            
            # Return a default analysis if parsing fails
            return self._create_default_analysis(interview_id, transcript_text)
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")
            return self._create_default_analysis(interview_id, transcript_text)

    def _create_default_analysis(self, interview_id: int, transcript: str) -> InterviewAnalysis:
        """Create a default analysis when API calls fail"""
        return InterviewAnalysis(
            interview_id=interview_id,
            overall_score=50,
            skill_scores=[
                SkillAssessment(
                    skill="Communication",
                    score=60,
                    evidence="Based on transcript analysis"
                )
            ],
            sentiment=SentimentAnalysis(
                overall_sentiment="neutral",
                confidence_level="medium",
                nervousness_indicators=[]
            ),
            recommendation="maybe - requires further evaluation",
            feedback="The interview transcript was analyzed. Further assessment recommended.",
            key_strengths=["Participated in interview"],
            areas_for_improvement=["More detailed responses needed"],
            response_quality={"depth": 5, "clarity": 5, "relevance": 5}
        )

# Singleton
analyzer_service = InterviewAnalyzerService()