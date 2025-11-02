from pydantic import BaseModel, EmailStr,Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CandidateRequestBody(BaseModel):
    company_id:str
    jobid:str
    name:str
    email:EmailStr
    
    