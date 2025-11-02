# Backend-Pipecat WebSocket Integration

## Overview
Real-time bidirectional communication between FastAPI backend and Pipecat bot using WebSockets.

## Setup

### 1. Install Dependencies
```bash
# Backend (already installed)
pip install websockets

# Pipecat
cd pipecat-quickstart
uv sync
```

### 2. Start Services
```bash
# Terminal 1: Backend
cd server
uvicorn main:app --reload

# Terminal 2: Pipecat
cd pipecat-quickstart
uv run bot.py
```

## How It Works

### Backend → Pipecat
- Backend sends `start_interview` event when interview is created
- Pipecat receives interview_id and config via WebSocket

### Pipecat → Backend
- Pipecat sends `client_connected` when user joins
- Pipecat sends `client_disconnected` when user leaves
- Backend automatically marks interview as completed

## Events

### start_interview
```json
{
  "type": "start_interview",
  "interview_id": 123,
  "config": {...}
}
```

### client_connected
```json
{
  "type": "client_connected",
  "interview_id": 123
}
```

### client_disconnected
```json
{
  "type": "client_disconnected",
  "interview_id": 123
}
```

## Files Modified
- `server/main.py` - WebSocket endpoint
- `server/app/services/websocket_service.py` - WebSocket manager
- `server/app/services/pipecat_service.py` - Send events to Pipecat
- `pipecat-quickstart/websocket_client.py` - WebSocket client
- `pipecat-quickstart/bot.py` - Integration with bot events
