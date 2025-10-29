from pydantic import BaseModel,Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Status(str,Enum):
    Filled="Filled"
    Pending="Pending"

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
    company_id:int
    title:str
    description:str
    status:Status="Pending"
    createdAt:datetime
    updatedAt:Optional[datetime]=None

def checkenum(value):
    return value in [x.value for x in Status]