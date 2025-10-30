"""API routes for interview analysis"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ..models.analysis import AnalyzeInterviewRequest, AnalysisResponse
from ..services.interview_analyzer import analyzer_service
from ..core.database import get_db
from supabase import Client
import json

router = APIRouter()

@router.post("/analyze-interview", response_model=AnalysisResponse)
async def analyze_interview(
    request: AnalyzeInterviewRequest,
    db: Client = Depends(get_db)
):
    """
    Receive transcript, analyze it, and store results in database
    """
    try:
        # 1. Get job requirements from database
        interview = db.table("interview")\
            .select("*, Job(title, description, Job_Requirements(skill))")\
            .eq("id", request.interview_id)\
            .single()\
            .execute()

        if not interview.data:
            raise HTTPException(status_code=404, detail="Interview not found")

        job_data = interview.data["Job"]
        job_requirements = [req["skill"] for req in job_data["Job_Requirements"]]

        # 2. Analyze transcript using Gemini
        analysis = await analyzer_service.analyze_interview(
            interview_id=request.interview_id,
            transcript=[t.dict() for t in request.transcript],
            job_requirements=job_requirements,
            job_description=job_data["description"]
        )

        # 3. Store transcript as JSON file (or in database)
        transcript_data = json.dumps([t.dict() for t in request.transcript])

        # 4. Insert Report into database
        report = db.table("Report").insert({
            "interview_id": request.interview_id,
            "overallscore": analysis.overall_score,
            "recommondation": analysis.recommendation,
            "feedback": analysis.feedback,
            "transcripturl": f"transcripts/{request.interview_id}.json"  # Or store in blob storage
        }).execute()

        report_id = report.data[0]["_id"]

        # 5. Insert skill scores
        skill_score_records = [
            {
                "skill": skill.skill,
                "interview_id": request.interview_id,
                "score": skill.score
            }
            for skill in analysis.skill_scores
        ]

        db.table("skill score").insert(skill_score_records).execute()

        # 6. Update interview status
        db.table("interview")\
            .update({"status": "completed"})\
            .eq("id", request.interview_id)\
            .execute()

        # 7. Return analysis response
        return AnalysisResponse(
            interview_id=request.interview_id,
            overall_score=analysis.overall_score,
            recommendation=analysis.recommendation,
            feedback=analysis.feedback,
            skill_scores=[
                {"skill": s.skill, "score": s.score, "evidence": s.evidence}
                for s in analysis.skill_scores
            ],
            sentiment=analysis.sentiment.dict(),
            key_strengths=analysis.key_strengths,
            areas_for_improvement=analysis.areas_for_improvement,
            created_at=report.data[0].get("createdAt")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/interview/{interview_id}/analysis", response_model=AnalysisResponse)
async def get_interview_analysis(
    interview_id: int,
    db: Client = Depends(get_db)
):
    """Retrieve existing analysis for an interview"""
    try:
        report = db.table("Report")\
            .select("*, skill score(*)")\
            .eq("interview_id", interview_id)\
            .single()\
            .execute()

        if not report.data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        data = report.data

        return AnalysisResponse(
            interview_id=interview_id,
            overall_score=data["overallscore"],
            recommendation=data["recommondation"],
            feedback=data["feedback"],
            skill_scores=[
                {"skill": s["skill"], "score": s["score"], "evidence": ""}
                for s in data["skill score"]
            ],
            sentiment={},  # Load from JSON if stored separately
            key_strengths=[],
            areas_for_improvement=[],
            created_at=data.get("createdAt")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))