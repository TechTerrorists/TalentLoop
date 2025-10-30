from pydantic import BaseModel,Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
class Recommondation(str,Enum):
    Recommonded="Recommonded"
    Not_Recommoned="Not Recommonded"
class ReportCreate(BaseModel):
    interview_id:int
    overallscore:Optional[int]=0
    recommondation:Recommondation
    feedback:Optional[str]=None
    transcripturl:Optional[str]=None
    createdAt:datetime=Field(default_factory=datetime.utcnow)
class ReportResponse(ReportCreate):
    _id:int
    createdAt:datetime
    updatedAr:Optional[datetime]=None

class skillscore(BaseModel):
    skill:str
    interview_id:int
    score:int
