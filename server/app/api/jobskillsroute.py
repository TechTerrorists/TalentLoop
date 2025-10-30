from fastapi import FastAPI,APIRouter,HTTPException
from app.core.database import supabase
from typing import List
from app.models.jobskils import JobSkill
router=APIRouter()
tablename="Job_Requirements"

@router.post("/add-jobskills/{jobid}",response_model=List[JobSkill])
async def addJobSkills(jobid:int,request:List[str]):
    data=[{"job_id":jobid,"skill":skill} for skill in request]
    result= supabase.table(tablename).insert(data).execute()
    
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when creating job requirements")

@router.delete("/delete-jobskills/{jobid}",response_model=List[JobSkill])
async def DeleteJobSkills(jobid:int):
    result= supabase.table(tablename).delete().eq("job_id",jobid).execute()
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when deleting job skill")
@router.delete("/delete-jobskill/{jobid}",response_model=JobSkill)
async def DeleteJobSkills(jobid:int,skill:str):
    result= supabase.table(tablename).delete().eq("job_id",jobid).eq("skill",skill).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when deleting job skill")

@router.get("/{jobid}",response_model=List[JobSkill])
def getAllJobSkills(jobid:int):
    result=supabase.table(tablename).select("*").eq("job_id",jobid).execute()
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when getting job skills")

@router.get("/",response_model=List[JobSkill])
async def getAllJobSkillsCompany(companyid:int):
    jobs = supabase.table("Job").select("_id").eq("company_id",companyid ).execute()
    job_id = [job["_id"] for job in jobs.data]
    result = supabase.table(tablename).select("*").in_("job_id", job_id).execute()

    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when getting job skills")