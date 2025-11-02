from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter()

class InterviewRequest(BaseModel):
    candidate_id: int

# Global variable to store current interview session
current_interview_session = {"candidate_id": None}

@router.post("/start-interview")
async def start_interview(request: InterviewRequest):
    """Start an interview session with a specific candidate ID"""
    try:
        # Store the candidate ID for the bot to access
        current_interview_session["candidate_id"] = request.candidate_id
        
        return {
            "message": "Interview session started",
            "candidate_id": request.candidate_id,
            "status": "ready"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@router.get("/current-session")
async def get_current_session():
    """Get the current interview session details"""
    return current_interview_session

@router.post("/end-interview")
async def end_interview():
    """End the current interview session"""
    current_interview_session["candidate_id"] = None
    return {"message": "Interview session ended"}