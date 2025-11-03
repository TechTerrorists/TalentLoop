"""API routes for interview analysis"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..models.analysis import AnalysisResponse, SkillScoreResponse
from ..core.database import get_db
from supabase import Client

router = APIRouter()

# Analysis is handled by bot.py using geminiPrompt.py
# This endpoint is not needed as bot.py directly inserts into database

@router.get("/interview/{interview_id}/analysis")
async def get_interview_analysis(
    interview_id: int,
    db: Client = Depends(get_db)
):
    """Retrieve existing analysis for an interview"""
    try:
        # Get report data
        report = db.table("Report")\
            .select("*")\
            .eq("interview_id", interview_id)\
            .maybe_single()\
            .execute()
        print(report.data["recommendation"])
        if not report or not report.data:
            raise HTTPException(status_code=404, detail="Analysis not found for this interview")

        data = report.data
        
        # Get skill scores separately using interview_id
        # skill_scores = db.table("skill score")\
        #     .select("*")\
        #     .eq("interview_id", interview_id)\
        #     .execute()
        return {
            "interview_id":interview_id,
            "overall_score":data.get("overallscore", 0),
            "recommendation":data["recommendation"],
            "professionalism":data.get("professionalism", 0),
            "communication":data.get("communication", 0),
            "technical_skills":data.get("technicalDepth", 0),
            "positive_attitude":data.get("positiveAttitude", 0),
            "responsequality":data.get("responseQuality", 0),
            "communication":data.get("communication", 0),
            "feedback":data["evidence"],
            "key_strengths":data["keyStrengths"] ,
            "areas_for_improvement":data["areasOfImprovement"],
            "created_at":data.get("createdAt", datetime.now().isoformat())
        }

    except Exception as e:
        import traceback
        print(f"Error in get_interview_analysis: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Analysis retrieval failed: {str(e)}")