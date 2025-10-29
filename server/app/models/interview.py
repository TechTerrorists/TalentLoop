from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class InterviewStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Interview(BaseModel):
    id: Optional[int] = None
    candidate_id: int
    company_id: int
    job_id: int
    status: str = "pending"
    Schedule_Date: Optional[datetime] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    bot_url: Optional[str] = None

class InterviewCreate(BaseModel):
    candidate_id: int
    company_id: int
    job_id: int
    language: str = "en"
    avatar_enabled: bool = True

class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    company_id: int
    job_id: int
    status: str
    Schedule_Date: Optional[datetime] = None
    createdAt: Optional[datetime] = None
    bot_url: Optional[str] = None
