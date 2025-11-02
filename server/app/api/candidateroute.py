from fastapi import FastAPI,APIRouter,HTTPException,UploadFile,File
from app.core.database import supabase
from typing import List
from py_pdf_parser.loaders import load_file
import os
import uuid
import shutil

from app.models.candidate import CandidateRequestBody
# from app.models.jobs_models import JobRequestBody,JobResponse,checkenum
router=APIRouter()
tablename="Candidate_Info"
folderpath="upload"
@router.post("/uploadresume/{candidateid}")
def pdftotextresume(candidateid:int ,file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Resume should be Pdf only")
    unique_name = str(uuid.uuid4())
    file_path=os.path.join(folderpath, f"{unique_name}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    document = load_file(file_path)
    resumetext = " ".join([element.text() for element in document.elements])
    result=supabase.table(tablename).update({"resumeurl":resumetext}).eq("id",candidateid).execute()
    os.remove(file_path)
    if(result.data):
        return resumetext
    raise HTTPException(status_code=500, detail="something went wrong when uploading resume text")

@router.post("/addcandidate")
def addcandidate(request:CandidateRequestBody):
    data=request.model_dump()
    result=supabase.table(tablename).insert(data).execute()
    if result.data:
        return result.data[0]
    raise HTTPException(status_code=404, detail="Unable to add candidate info")

@router.delete("/deletecandidate/{candidateid}")
def deletecandidate(candidateid:int):
    result=supabase.table(tablename).delete().eq("id",candidateid).execute()
    if result.data:
        return result.data[0]
    raise HTTPException(status_code=404, detail="Unable to delete candidate info")

@router.patch("/updatecandidate/{candidateid}")
def updatecandidate(candidateid:int,request:CandidateRequestBody):
    data=request.model_dump()
    result=supabase.table(tablename).update(data).eq("id",candidateid).execute()
    if result.data:
        return result.data[0]
    raise HTTPException(status_code=404, detail="Unable to update candidate info")

@router.get("/{candidateid}")
def getcandidate(candidateid:int):
    result=supabase.table(tablename).select("*").eq("id",candidateid).execute()
    if result.data:
        return result.data[0]
    raise HTTPException(status_code=404, detail="Unable to get candidate info")

@router.get("/")
def getAllCandidates(jobid:int):
    result=supabase.table(tablename).select("*").eq("jobid",jobid).execute()
    if result.data:
        return result.data
    raise HTTPException(status_code=404, detail="Unable to get all candidates info")