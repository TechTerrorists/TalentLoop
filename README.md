# AI Avatar Interview System

A comprehensive interview platform using AI avatars with real-time voice interaction.

## Tech Stack

### Frontend
- **Next.js 16** with React, JavaScript and TypeScript
- **Tailwind CSS** for styling
- **WebRTC** for real-time communication

### Backend
- **FastAPI** with Python
- **Pipecat** for AI conversation handling
- **WebRTC Server** for media streaming

### AI/ML Services
- **Gemini API** for LLM
- **Deepgram** for speech recognition
- **ElevenLabs/Azure TTS** for speech synthesis
- **Tavus** for video analysis

### Database & Storage
- **Supabase** (PostgreSQL + Auth)
- **Vector DB** for embeddings

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # FastAPI server
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Key Features

- Real-time AI avatar interviews
- Voice-only interview mode
- Multi-language support (30+ languages)
- Comprehensive scoring system
- Advanced interview workflows
- B2B and B2C business models