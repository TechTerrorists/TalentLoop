from fastapi import FastAPI,APIRouter,HTTPException
from app.core.database import supabase
from typing import List
from app.models.jobs_models import JobRequestBody,JobResponse,checkenum
router=APIRouter()
tablename="Job"
@router.post("/add-job",response_model=JobResponse)
async def addJob(request:JobRequestBody):
    data=request.model_dump()
    result= supabase.table(tablename).insert(data).execute()
    
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when craeting job")

@router.delete("/delete-job/{jobid}",response_model=JobResponse)
async def DeleteJob(jobid:int):
    result= supabase.table(tablename).delete().eq("_id",jobid).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when deleting job")

@router.patch("/update-job/{jobid}",response_model=JobResponse)
async def updateJob(jobid:int,request:JobRequestBody):
    data=request.model_dump()
    result= supabase.table(tablename).update(data).eq("_id",jobid).execute()
    
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when updating job")
@router.patch("/update-status/{jobid}",response_model=JobResponse)
async def updatejobstatus(jobid:int,status:str):
    if(not checkenum(status)):
        raise HTTPException(status_code=404, detail="status should be only pending or filled")    
    result =supabase.table(tablename).update({"status":status}).eq("_id",jobid).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when updatiog job status")

@router.get("/{company_id}",response_model=List[JobResponse])
def getAllJobs(company_id:int):
    result=supabase.table(tablename).select("*").eq("company_id",company_id).execute()
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when getting jobs")

@router.get("/job/{jobid}",response_model=JobResponse)
def getJob(jobid:int):
    result=supabase.table(tablename).select("*").eq("_id",jobid).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=404, detail="Job not found")