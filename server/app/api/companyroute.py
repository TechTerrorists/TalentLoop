from fastapi import FastAPI,APIRouter,HTTPException
from app.core.database import supabase
from typing import List
from app.models.company import CompanyRequestBody,CompanyCreate,CompanyLogin,CompanyResponse, UpdateCompany
router=APIRouter()
tablename="Company"
@router.post("/createcompany",response_model=CompanyResponse)
def createcompany(request:CompanyRequestBody):
    data=request.model_dump()
    result=supabase.table(tablename).insert(data).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500,detail="Something went wrong when craeting company")    

@router.patch("/updatecompany/{compid}",response_model=CompanyResponse)
def updatecompanydetails(compid:int,request:UpdateCompany):
    data=request.model_dump()
    result=supabase.table(tablename).update(data).eq("_id",compid).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500,detail="Something went wrong when updating company")    
@router.delete("/deletecompany/{compid}",response_model=CompanyResponse)
def deletecompany(compid:int):
    result=supabase.table(tablename).delete().eq("_id",compid).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500,detail="Something went wrong when deleting company")

@router.get("/{compid}",response_model=CompanyResponse)
def getcompany(compid:int):
    result=supabase.table(tablename).select("*").eq("_id",compid).execute()
    if(result.data):
        result.data[0].pop("password")
        return result.data[0]
    raise HTTPException(status_code=500,detail="Something went wrong when deleting company")