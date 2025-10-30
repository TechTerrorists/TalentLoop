from pydantic import BaseModel,Field
from typing import Optional, List

class JobSkill(BaseModel):
    job_id:int
    skill:str
