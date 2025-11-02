import asyncio
import websockets
import json
import os

class BackendWebSocketClient:
    def __init__(self):
        self.ws = None
        self.backend_url = "ws://localhost:8000/ws/pipecat"
        self.current_interview_id = None
        self.current_candidate_id = None
        self.data_ready = asyncio.Event()
    
    async def connect(self):
        try:
            self.ws = await websockets.connect(self.backend_url)
            print("✅ Connected to backend WebSocket")
            return True
        except Exception as e:
            print(f"❌ Failed to connect to backend: {e}")
            self.ws = None
            return False
    
    async def send_event(self, event_type: str, data: dict = None):
        if not self.ws:
            return
        
        message = {"type": event_type, **(data or {})}
        await self.ws.send(json.dumps(message))
    
    async def client_connected(self, interview_id: int):
        self.current_interview_id = interview_id
        await self.send_event("client_connected", {"interview_id": interview_id})
    
    async def client_disconnected(self, interview_id: int):
        await self.send_event("client_disconnected", {"interview_id": interview_id})
        self.current_interview_id = None
    
    async def listen(self):
        if not self.ws:
            return
        
        try:
            async for message in self.ws:
                data = json.loads(message)
                if data.get("type") == "start_interview":
                    self.current_interview_id = data.get("interview_id")
                    self.current_candidate_id = data.get("candidate_id")
                    self.data_ready.set()
                    print(f"📝 Interview {self.current_interview_id} started for candidate {self.current_candidate_id}")
        except Exception as e:
            print(f"WebSocket error: {e}")
    
    async def wait_for_data(self, timeout=5):
        try:
            await asyncio.wait_for(self.data_ready.wait(), timeout=timeout)
            return True
        except asyncio.TimeoutError:
            print(f"⚠️ Timeout waiting for interview data from backend")
            return False
    
    async def get_candidate_id(self):
        await self.wait_for_data()
        return self.current_candidate_id
    
    async def get_interview_id(self):
        await self.wait_for_data()
        return self.current_interview_id

ws_client = BackendWebSocketClient()
