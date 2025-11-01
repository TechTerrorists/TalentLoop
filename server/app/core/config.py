from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    PROJECT_NAME: str = "AI Avatar Interview System"
    
    # AI Services
    GOOGLE_API_KEY: str = ""
    DEEPGRAM_API_KEY: str = ""
    CARTESIA_API_KEY: str = ""
    TAVUS_API_KEY: str = ""
    
    # Database
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY:str=""
    SMTP_HOST:str=""
    SMTP_PORT:str=""
    SMTP_USER:str=""
    SMTP_PASS:str=""
    JWT_SECRET:str=""
    class Config:
        env_file = ".env"

settings = Settings()