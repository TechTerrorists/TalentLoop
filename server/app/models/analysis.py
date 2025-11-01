"""Pydantic models for interview analysis"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class TranscriptEntry(BaseModel):
    timestamp: str
    speaker: str
    text: str

class AnalyzeInterviewRequest(BaseModel):
    interview_id: int
    transcript: List[TranscriptEntry]
    conversation_context: Optional[List[Dict]] = None

class SkillScoreResponse(BaseModel):
    skill: str
    score: int
    evidence: str

class AnalysisResponse(BaseModel):
    interview_id: int
    overall_score: int
    recommendation: str
    feedback: str
    skill_scores: List[SkillScoreResponse]
    sentiment: Dict[str, Any]
    key_strengths: List[str]
    areas_for_improvement: List[str]
    created_at: datetime