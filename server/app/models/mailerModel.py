from pydantic import BaseModel,EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class InvitePayLoad(BaseModel):
    name: str
    email: EmailStr
    company_id: int
    job_id: int
    schedule_date: str
    schedule_time: str