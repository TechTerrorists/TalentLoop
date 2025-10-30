from fastapi import FastAPI,APIRouter,HTTPException
from app.core.database import supabase
from typing import List
from app.models.report import ReportCreate,ReportResponse,skillscore
router=APIRouter()
tablename="Report"
@router.post("/addskillscores")
async def Addskillscore(request:List[skillscore]):
    data = [item.model_dump() for item in request]
    result=supabase.table("skill score").insert(data).execute()
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when adding skill score")
@router.get("/skillscores/{interviewid}")
async def getallskill(interviewid:int):
    result=supabase.table("skill score").select("*").eq("interview_id",interviewid).execute()
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when getting skill score of particular interview")

@router.post("/CreateReport",response_model=ReportResponse)
async def CreateReport(request:ReportCreate):
    data=request.model_dump(mode="json")
    skillscores=supabase.table("skill score").select("score").eq("interview_id",data["interview_id"]).execute()
    overallscore=sum(score["score"] for score in skillscores.data)
    if(not len(skillscores.data)==0):
        data["overallscore"]=int(overallscore/len(skillscores.data))
    result= supabase.table(tablename).insert(data).execute()
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when creating report")


@router.post("/",response_model=List[ReportResponse])
async def getAllReportsOfAJob(interviewid:List[int]):
    result= supabase.table(tablename).select("*").in_("interview_id",interviewid).execute()
    
    if(result.data):
        return result.data
    raise HTTPException(status_code=500, detail="something went wrong when creating report")

@router.get("/{reportid}",response_model=ReportResponse)
async def getReport(reportid:int):
    result= supabase.table(tablename).select("*").eq("_id",reportid).execute()
    
    if(result.data):
        return result.data[0]
    raise HTTPException(status_code=500, detail="something went wrong when getting report")
