import os
import json
from typing import Dict, List, Any
from google import generativeai as genai
from pydantic import BaseModel, Field
import copy

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

    async def analyze_interview(
        self,
        interview_id: int,
        transcript: List[Dict],
        job_requirements: List[str],
        job_description: str
    ) -> InterviewAnalysis:
        """Analyze interview transcript using Gemini"""

        transcript_text = self._format_transcript(transcript)
        prompt = self._create_analysis_prompt(transcript_text, job_requirements, job_description)

        # 🔧 Clean schema to remove unsupported JSON Schema fields
        schema = InterviewAnalysis.model_json_schema()
        schema_copy = copy.deepcopy(schema)
        self._clean_schema(schema_copy)

        # Call Gemini
        response = await self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=schema_copy
            )
        )

        analysis_data = json.loads(response.text)
        analysis_data["interview_id"] = interview_id

        return InterviewAnalysis(**analysis_data)

    def _clean_schema(self, schema: dict):
        """Remove unsupported fields like 'maximum' or 'minimum' recursively"""
        if isinstance(schema, dict):
            # First, remove unsupported fields at this level
            for key in list(schema.keys()):
                if key in ("maximum", "minimum", "exclusiveMaximum", "exclusiveMinimum"):
                    schema.pop(key)

            # Then recursively clean nested structures
            for key, value in schema.items():
                if isinstance(value, (dict, list)):
                    self._clean_schema(value)
        elif isinstance(schema, list):
            for item in schema:
                if isinstance(item, (dict, list)):
                    self._clean_schema(item)

    def _format_transcript(self, transcript: List[Dict]) -> str:
        formatted = []
        for entry in transcript:
            speaker = entry.get("speaker", "unknown")
            text = entry.get("text", "")
            timestamp = entry.get("timestamp", "")
            formatted.append(f"[{timestamp}] {speaker}: {text}")
        return "\n".join(formatted)

    def _create_analysis_prompt(self, transcript: str, requirements: List[str], job_desc: str) -> str:
        return f"""
You are an expert technical interviewer analyzing a candidate's interview performance.

JOB DESCRIPTION:
{job_desc}

REQUIRED SKILLS:
{', '.join(requirements)}

INTERVIEW TRANSCRIPT:
{transcript}

Analyze this interview comprehensively and return a JSON response with:
- skill_scores
- sentiment
- overall_score
- recommendation
- feedback
- key_strengths
- areas_for_improvement
- response_quality
"""

# Singleton
analyzer_service = InterviewAnalyzerService()
