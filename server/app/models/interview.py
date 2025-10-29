from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class InterviewStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class InterviewType(str, Enum):
    PRACTICE = "practice"
    REAL = "real"
    VOICE_ONLY = "voice_only"

class InterviewSession(BaseModel):
    id: Optional[str] = None
    candidate_id: str
    job_position: str
    interview_type: InterviewType
    status: InterviewStatus = InterviewStatus.SCHEDULED
    bot_url: Optional[str] = None
    
class InterviewConfig(BaseModel):
    job_description: str
    required_skills: List[str]
    language: str = "en"
    avatar_enabled: bool = True