from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings
from app.api.jobroute import router as job_router 
from app.api.companyroute import router as company_router
from app.api.candidateroute import router as candidate_router
app = FastAPI(
    title="AI Avatar Interview API",
    description="Backend API for AI-powered interview system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(company_router, prefix="/company", tags=["Company"])
app.include_router(candidate_router, prefix="/candidate", tags=["CandidateInfo"])
@app.get("/")
async def root():
    return {"message": "AI Avatar Interview API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)