import asyncio
from typing import Optional
from datetime import datetime
from app.models.interview import Interview, InterviewCreate
from app.models.report import ReportCreate, skillscore
from app.services.pipecat_service import PipecatService
from app.core.database import supabase

class InterviewService:
    def __init__(self):
        self.pipecat_service = PipecatService()
        self.sessions = {}
    
    async def create_session(self, config: InterviewCreate) -> Interview:
        """Create a new interview session"""
        if supabase:
            result = supabase.table("interview").insert({
                "candidate_id": config.candidate_id,
                "company_id": config.company_id,
                "job_id": config.job_id,
                "status": "pending",
                "Schedule_Date": datetime.now().isoformat()
            }).execute()
            data = result.data[0]
            return Interview(**data)
        
        # Fallback to in-memory
        session_id = len(self.sessions) + 1
        session = Interview(
            id=session_id,
            candidate_id=config.candidate_id,
            company_id=config.company_id,
            job_id=config.job_id,
            status="pending",
            createdAt=datetime.now()
        )
        self.sessions[session_id] = session
        return session
    
    async def start_session(self, session_id: int) -> bool:
        """Start an interview session"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        if supabase:
            supabase.table("interview").update({
                "status": "in_progress",
                "updatedAt": datetime.now().isoformat()
            }).eq("id", session_id).execute()
        else:
            session.status = "in_progress"
            session.updatedAt = datetime.now()
        
        bot_config = {
            "job_id": session.job_id,
            "company_id": session.company_id,
            "language": "en"
        }
        
        bot_info = await self.pipecat_service.start_bot(session_id, bot_config)
        bot_url = bot_info.get("bot_url")
        
        if supabase:
            supabase.table("interview").update({
                "bot_url": bot_url
            }).eq("id", session_id).execute()
        else:
            session.bot_url = bot_url
        
        return True
    
    async def end_session(self, session_id: int) -> bool:
        """End an interview session"""
        if supabase:
            supabase.table("interview").update({
                "status": "completed",
                "updatedAt": datetime.now().isoformat()
            }).eq("id", session_id).execute()
        
        await self.pipecat_service.stop_bot(session_id)
        return True
    
    def get_session(self, session_id: int) -> Optional[Interview]:
        """Get session by ID"""
        if not supabase:
            return self.sessions.get(session_id)
        result = supabase.table("interview").select("*").eq("id", session_id).execute()
        if result.data:
            return Interview(**result.data[0])
        return None
    
    def list_all_sessions(self, candidate_id: int = None):
        """List all interview sessions or filter by candidate_id"""
        if not supabase:
            return list(self.sessions.values())
        
        query = supabase.table("interview").select("*")
        if candidate_id:
            query = query.eq("candidate_id", candidate_id)
        
        result = query.execute()
        return result.data if result.data else []
    
    async def create_report(self, interview_id: int, transcript: str) -> ReportCreate:
        """Create interview report with scores"""
        if supabase:
            result = supabase.table("Report").insert({
                "interview_id": interview_id,
                "overallscore": 0,
                "recommondation": "Analysis pending",
                "feedback": "Interview completed",
                "transcripturl": None,
                "createdAt": datetime.now().isoformat()
            }).execute()
            return ReportCreate(**result.data[0])
        
        return ReportCreate(
            interview_id=interview_id,
            overallscore=0,
            recommondation="Not Recommonded",
            feedback="Interview completed",
            createdAt=datetime.now()
        )