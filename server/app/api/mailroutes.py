from fastapi import APIRouter,HTTPException, Depends, Body
from app.models.mailerModel import InvitePayLoad
from app.services.mailer_service import TalentLoopMailer
from supabase import Client, create_client
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
import os

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

router = APIRouter()
mailerService = TalentLoopMailer()

@router.post("/inviteCandidates")
async def invite_candidates(payload: InvitePayLoad):
    existing = mailerService.call_user_by_email(payload.email)
    tempPass = mailerService.generate_temp_pass()
    hashedPass = mailerService.hash_password(tempPass)

    if existing:
        supabase.table("User").update({
            "password": hashedPass,
            "must_reset_password": True,
        }).eq("email",payload.email).execute()

        user = mailerService.call_user_by_email(payload.email)
    else:
        user = mailerService.insert_user(payload.name, payload.email, hashedPass)


    candidate = mailerService.insert_candidate(payload.name, payload.email, payload.company_id, payload.job_id)
    frontend_link = ""
    mailerService.insert_interview(candidate.get('id') or candidate.get("_id"), payload.job_id, payload.schedule_date, payload.schedule_time, frontend_link)

    html = f"""
    <h3>Hi {payload.name},</h3>
    <p>Your interview is scheduled on <b>{payload.schedule_date}</b> at <b>{payload.schedule_time}</b>.</p>
    <p>Use these credentials to sign in:</p>
    <ul>
      <li><b>Email:</b> {payload.email}</li>
      <li><b>Temporary password:</b> <code>{tempPass}</code></li>
    </ul>
    <p>Open the interview: <a href="{frontend_link}">Start Interview</a></p>
    <p>You'll be asked to change your password after signing in.</p>
    """

    await mailerService.send_email(payload.email, "TalentLoop - Interview Invite", html)
    return {"message": "Invitation sent successfully to candidate.", "email":payload.email}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # username = email in this form
    user = mailerService.call_user_by_email(form_data.username)
    if not user or not mailerService.verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    # include minimal claims
    token = mailerService.create_access_token({"sub": user["email"], "role": user.get("role", "candidate")})
    return {"access_token": token, "token_type": "bearer", "expires_in": mailerService.ACCESS_TOKEN_EXPIRES_MINUTES}

@router.post("/reset-password")
def reset_password(new_password: str = Body(...), current_user: dict = Depends(mailerService.get_current_user)):
    hashed = mailerService.hash_password(new_password)
    mailerService.update_password(current_user["_id"], hashed)
    return {"message": "password updated"}



