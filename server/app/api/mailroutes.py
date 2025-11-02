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

@router.post("/mailCandidate/{interviewid}")
async def invite_candidates(interviewid:int):
    result = supabase.table("interview").select("*, Candidate_Info(*)").eq("id", interviewid).execute()
    data=result.data[0]
    print(result)
    existing = mailerService.call_user_by_email(data["Candidate_Info"]["email"])
    tempPass = mailerService.generate_temp_pass()
    hashedPass = mailerService.hash_password(tempPass)

    if existing:
        supabase.table("User").update({
            "password": hashedPass,
            "must_reset_password": True,
        }).eq("email",data["Candidate_Info"]["email"]).execute()

        user = existing
    else:
        user = mailerService.insert_user(data["Candidate_Info"]["name"],data["Candidate_Info"]["email"], hashedPass)


    frontend_link = ""
    html = f"""
    <h3>Hi {data["Candidate_Info"]["email"]},</h3>
    <p>Your interview is scheduled on <b>{data["Schedule_Date"]}</b> at <b>{data["Schedule_Time"]}</b>.</p>
    <p>Use these credentials to sign in:</p>
    <ul>
      <li><b>Email:</b> {data["Candidate_Info"]["email"]}</li>
      <li><b>Temporary password:</b> <code>{tempPass}</code></li>
    </ul>
    <p>Open the interview: <a href="{frontend_link}">Start Interview</a></p>
    <p>You'll be asked to change your password after signing in.</p>
    """

    await mailerService.send_mail(data["Candidate_Info"]["email"], "TalentLoop - Interview Invite", html)
    return {"message": "Invitation sent successfully to candidate.", "email":data["Candidate_Info"]["email"]}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # username = email in this form
    user = mailerService.call_user_by_email(form_data.username)
    if not user or not mailerService.verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    # include minimal claims
    token = mailerService.create_access_token({"sub": user["email"], "role": user.get("role", "candidate")})
    return {"access_token": token, "token_type": "bearer", "expires_in": mailerService.ACCESS_TOKEN_EXPIRES_MINUTES}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/mail/login")

@router.post("/reset-password")
def reset_password(new_password: str = Body(...), token: str = Depends(oauth2_scheme)):
    current_user = mailerService.get_current_user(token)
    hashed = mailerService.hash_password(new_password)
    mailerService.update_password(current_user["_id"], hashed)
    return {"message": "password updated"}

@router.get("/me")
def get_current_candidate(token: str = Depends(oauth2_scheme)):
    current_user = mailerService.get_current_user(token)
    result = supabase.table("Candidate_Info").select("*").eq("email", current_user["email"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return result.data[0]


