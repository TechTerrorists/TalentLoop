from pydantic import BaseModel,Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Status(str,Enum):
    "Filled"
    "Pending"

class JobRequestBody(BaseModel):
    company_id:int
    title:str
    description:str
    status:Status="Pending"
class CreateJob(JobRequestBody):
    createdAt:datetime=Field(default_factory=datetime.utcnow)
    updatedAt:Optional[datetime]=None
    
class JobResponse(BaseModel):
    _id:int
    title:str
    description:str
    status:Status="Pending"
    company_id:int
    createdAt:datetime
    updatedAt:Optional[datetime]=None