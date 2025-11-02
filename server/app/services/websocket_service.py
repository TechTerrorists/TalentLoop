from fastapi import WebSocket
from typing import Dict, Set
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.pipecat_connection: WebSocket = None
        self.pending_interviews: Dict[int, dict] = {}
    
    async def connect_pipecat(self, websocket: WebSocket):
        await websocket.accept()
        self.pipecat_connection = websocket
        
        # Send any pending interviews
        for interview_id, message in list(self.pending_interviews.items()):
            await self.send_to_pipecat(message)
            del self.pending_interviews[interview_id]
    
    async def disconnect_pipecat(self):
        self.pipecat_connection = None
    
    async def send_to_pipecat(self, message: dict):
        if self.pipecat_connection:
            await self.pipecat_connection.send_json(message)
        else:
            # Store for when Pipecat connects
            if message.get("type") == "start_interview":
                interview_id = message.get("interview_id")
                self.pending_interviews[interview_id] = message
    
    async def handle_pipecat_message(self, message: dict):
        """Handle messages from Pipecat"""
        event_type = message.get("type")
        
        if event_type == "client_connected":
            interview_id = message.get("interview_id")
            print(f"Client connected to interview {interview_id}")
        
        elif event_type == "client_disconnected":
            interview_id = message.get("interview_id")
            print(f"Client disconnected from interview {interview_id}")
            # Update interview status
            from app.core.database import supabase
            if supabase:
                supabase.table('interview').update({
                    'status': 'completed'
                }).eq('id', interview_id).execute()

manager = WebSocketManager()
