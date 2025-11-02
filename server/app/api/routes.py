from fastapi import APIRouter, HTTPException
from app.models.interview import Interview, InterviewCreate, InterviewResponse
from app.models.report import ReportCreate
from app.services.interview_service import InterviewService

router = APIRouter()
interview_service = InterviewService()

@router.post("/interviews/", response_model=InterviewResponse)
async def create_interview(config: InterviewCreate):
    """Create a new interview session"""
    try:
        session = await interview_service.create_session(config)
        return session
    except Exception as e:
        import traceback
        print(f"Error creating interview: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/interviews/{session_id}", response_model=InterviewResponse)
async def get_interview(session_id: int):
    """Get interview session details"""
    session = interview_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/interviews/{session_id}/start")
async def start_interview(session_id: int):
    """Start an interview session"""
    success = await interview_service.start_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    session = interview_service.get_session(session_id)
    return {
        "message": "Interview started", 
        "session_id": session_id,
        "bot_url": session.bot_url
    }

@router.post("/interviews/{session_id}/end")
async def end_interview(session_id: int):
    """End an interview session"""
    success = await interview_service.end_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Interview ended", "session_id": session_id}

@router.get("/interviews/{session_id}/report", response_model=ReportCreate)
async def get_interview_report(session_id: int):
    """Get interview report with scores"""
    report = await interview_service.create_report(session_id, "")
    return report

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Interview API"}

@router.get("/interviews/")
async def list_interviews(candidate_id: int = None):
    """List all interviews or filter by candidate_id"""
    try:
        interviews = interview_service.list_all_sessions(candidate_id)
        return interviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))