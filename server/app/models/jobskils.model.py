from pydantic import BaseModel,Field
from typing import Optional, List

class JobSkills(BaseModel):
    job_id:int
    skills:List[str]
