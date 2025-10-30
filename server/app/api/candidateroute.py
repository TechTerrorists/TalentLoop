from fastapi import FastAPI,APIRouter,HTTPException,UploadFile,File
from app.core.database import supabase
from typing import List
from py_pdf_parser.loaders import load_file
import os
import uuid
import shutil
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