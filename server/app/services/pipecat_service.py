import os
import subprocess
from typing import Optional
import httpx

class PipecatService:
    def __init__(self):
        self.active_bots = {}
        self.pipecat_path = "/mnt/e/Coding Playground/QuantumHex/AI Avatar Interview Website/pipecat-quickstart"
        self.bot_base_url = "http://localhost:7861"
    
    async def start_bot(self, session_id: str, config: dict) -> dict:
        """Start a Pipecat bot for an interview session"""
        try:
            # Store session config for bot customization
            self.active_bots[session_id] = {
                "job_position": config.get("job_position", "Software Engineer"),
                "required_skills": ", ".join(config.get("required_skills", [])),
                "language": config.get("language", "en")
            }
            
            # Set environment variable for bot to access
            os.environ["INTERVIEW_ID"] = str(session_id)
            
            # Notify Pipecat about new interview
            from app.services.websocket_service import manager
            from app.core.database import supabase
            
            # Get candidate_id from interview
            interview = supabase.table("interview").select("candidate_id").eq("id", session_id).execute()
            candidate_id = interview.data[0]["candidate_id"] if interview.data else None
            
            await manager.send_to_pipecat({
                "type": "start_interview",
                "interview_id": session_id,
                "candidate_id": candidate_id,
                "config": self.active_bots[session_id]
            })
            
            # Bot is already running, just return connection details
            # In production, you'd start a new bot instance per session
            return {
                "session_id": session_id,
                "bot_url": self.bot_base_url,
                "status": "ready",
                "config": self.active_bots[session_id]
            }
        except Exception as e:
            raise Exception(f"Failed to start bot: {str(e)}")
    
    async def stop_bot(self, session_id: str) -> bool:
        """Stop a Pipecat bot and retrieve transcript"""
        if session_id in self.active_bots:
            # In production, retrieve transcript from bot before stopping
            config = self.active_bots[session_id]
            del self.active_bots[session_id]
            return True
        return False
    
    async def get_transcript(self, session_id: str) -> Optional[list]:
        """Get interview transcript for a session"""
        # In production, fetch from bot or database
        return None
    
    def get_bot_status(self, session_id: str) -> Optional[dict]:
        """Get bot status for a session"""
        return self.active_bots.get(session_id)
