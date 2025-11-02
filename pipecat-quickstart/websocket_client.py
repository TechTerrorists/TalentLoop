import asyncio
import websockets
import json
import os

class BackendWebSocketClient:
    def __init__(self):
        self.ws = None
        # Use Windows host IP for WSL
        import socket
        try:
            # Get Windows host IP from /etc/resolv.conf in WSL
            with open('/etc/resolv.conf', 'r') as f:
                for line in f:
                    if 'nameserver' in line:
                        host_ip = line.split()[1]
                        break
                else:
                    host_ip = 'localhost'
        except:
            host_ip = 'localhost'
        
        self.backend_url = "ws://172.21.32.1:8000/ws/pipecat"
        print(f"Backend URL: {self.backend_url}")
        self.current_interview_id = None
        self.current_candidate_id = None
        self.data_ready = asyncio.Event()
    
    async def connect(self, retries=3, delay=2):
        for attempt in range(retries):
            try:
                self.ws = await websockets.connect(self.backend_url)
                print("✅ Connected to backend WebSocket")
                return True
            except Exception as e:
                if attempt < retries - 1:
                    print(f"❌ Connection attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
                    await asyncio.sleep(delay)
                else:
                    print(f"❌ Failed to connect to backend after {retries} attempts: {e}")
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
