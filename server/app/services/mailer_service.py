import os, random, string
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from passlib.context import CryptContext
from jose import jwt, JWTError
import aiosmtplib
from email.mime.text import MIMEText
from app.models.mailerModel import InvitePayLoad


class TalentLoopMailer:
    def __init__(self):
        load_dotenv()

        # --- Environment variables ---
        self.SUPABASE_URL = os.getenv("SUPABASE_URL")
        self.SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        self.JWT_SECRET = os.getenv("JWT_SECRET")
        self.JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "60"))

        self.SMTP_HOST = os.getenv("SMTP_HOST")
        self.SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
        self.SMTP_USER = os.getenv("SMTP_USER")
        self.SMTP_PASS = os.getenv("SMTP_PASS")
        
        self.FRONTEND_BASE = os.getenv("FRONTEND_BASE", "http://localhost:3000")

        # --- Initialize clients ---
        self.supabase: Client = create_client(self.SUPABASE_URL, self.SUPABASE_SERVICE_ROLE_KEY)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/mail/login")
        self.app = FastAPI(title="TalentLoop Auth Service")

    # --- Utility Methods ---
    def generate_temp_pass(self) -> str:
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(10))

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=self.ACCESS_TOKEN_EXPIRES_MINUTES))
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        token = jwt.encode(to_encode, self.JWT_SECRET, algorithm=self.JWT_ALGORITHM)
        return token

    async def send_mail(self, to_email: str, subject: str, html: str):
        msg = MIMEText(html, "html")
        msg["From"] = self.SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        await aiosmtplib.send(
            msg,
            hostname=self.SMTP_HOST,
            port=self.SMTP_PORT,
            username=self.SMTP_USER,
            password=self.SMTP_PASS,
            start_tls=True,
        )

    # --- Database Methods ---
    def call_user_by_email(self, email: str):
        try:
            response = self.supabase.table("User").select("*").eq("email", email).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Failed to call user {e}")

    def insert_user(self, name, email, hashed_password):
        try:
            response = self.supabase.table("User").insert({
                "name": name,
                "email": email,
                "password": hashed_password,
                "role": "Candidate",
                "must_reset_password": True
            }).execute()
            return response.data[0]
        except Exception as e:
            raise Exception(f"Failed to insert user {e}")

    def update_password(self, user_id, hashed_password):
        try:
            res = self.supabase.table("User").update({
                "password": hashed_password,
                "must_reset_password": False,
                "updatedAt": datetime.utcnow().isoformat()
            }).eq("_id", user_id).execute()
            return res.data[0]
        except Exception as e:
            raise Exception(f"Failed to update password {e}")

    def insert_candidate(self, name, email, company_id, job_id):
        try:
            response = self.supabase.table("Candidate_Info").insert({
                "name": name,
                "email": email,
                "company_id": company_id,
                "jobid": job_id
            }).execute()
            return response.data[0]
        except Exception as e:
            raise Exception(f"Failed to insert candidate {e}")

    def insert_interview(self, candidate_id, company_id, job_id, schedule_date, schedule_time, bot_url):
        try:
            response = self.supabase.table("interview").insert({
                "candidate_id": candidate_id,
                "company_id": company_id,
                "job_id": job_id,
                "Schedule_Date": schedule_date,
                "Schedule_Time": schedule_time,
                "bot_url": bot_url
            }).execute()
            return response.data[0]
        except Exception as e:
            raise Exception(f"Failed to insert interview {e}")
        
#      AUTH
    def get_current_user(self, token: str):
        cred_exc = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, self.JWT_SECRET, algorithms=[self.JWT_ALGORITHM])
            email = payload.get("sub")
            if email is None:
                raise cred_exc
        except JWTError:
            raise cred_exc

        user = self.call_user_by_email(email)
        if not user:
            raise cred_exc
        return user
