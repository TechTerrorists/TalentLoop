from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..models.analysis import AnalysisResponse, SkillScoreResponse
from ..core.database import get_db
from supabase import Client

router = APIRouter()

report = db.table("Report")\
            .select("*")\
            .eq("interview_id", interview_id)\
            .maybe_single()\
            .execute()