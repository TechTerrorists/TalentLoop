from pydantic import BaseModel,Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
# import uuid
class CompanyRequestBody(BaseModel):
    email:str
    password:str
    name:str
    description:Optional[str]=None
    industry:Optional[str]=None
    
class CompanyCreate(CompanyRequestBody):
    createdAt:datetime=Field(default_factory=datetime.utcnow)

class CompanyLogin(BaseModel):
    email:str
    password:str
class UpdateCompany(BaseModel):
    name:str
    description:Optional[str]
    industry:Optional[str]
    email:str
class CompanyResponse(BaseModel):
    _id:int
    name:str
    description:Optional[str]
    industry:Optional[str]
    email:str