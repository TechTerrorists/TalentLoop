from supabase import create_client, Client
import os
from dotenv import load_dotenv
from .config import settings

load_dotenv()

def get_db() -> Client:
    """Get Supabase client"""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY   
    )

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase: Client = None
if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
