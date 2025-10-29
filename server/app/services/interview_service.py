import asyncio
from typing import Optional
from app.models.interview import InterviewSession, InterviewConfig
from app.services.pipecat_service import PipecatService

class InterviewService:
    def __init__(self):
        self.active_sessions = {}
        self.pipecat_service = PipecatService()
    
    async def create_session(self, config: InterviewConfig) -> InterviewSession:
        """Create a new interview session"""
        session = InterviewSession(
            id=f"session_{len(self.active_sessions) + 1}",
            candidate_id="candidate_1",  # TODO: Get from auth
            job_position=config.job_description[:50],
            interview_type="practice",
            status="scheduled"
        )
        
        self.active_sessions[session.id] = session
        return session
    
    async def start_session(self, session_id: str) -> bool:
        """Start an interview session"""
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            session.status = "in_progress"
            
            # Prepare bot config from session
            bot_config = {
                "job_position": session.job_position,
                "required_skills": [],  # Extract from session if stored
                "language": "en"
            }
            
            # Start Pipecat bot with interview context
            bot_info = await self.pipecat_service.start_bot(session_id, bot_config)
            session.bot_url = bot_info.get("bot_url")
            return True
        return False
    
    async def end_session(self, session_id: str) -> bool:
        """End an interview session"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id].status = "completed"
            # Stop Pipecat bot
            await self.pipecat_service.stop_bot(session_id)
            return True
        return False
    
    def get_session(self, session_id: str) -> Optional[InterviewSession]:
        """Get session by ID"""
        return self.active_sessions.get(session_id)