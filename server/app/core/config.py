from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    PROJECT_NAME: str = "AI Avatar Interview System"
    
    # AI Services
    GEMINI_API_KEY: str = ""
    DEEPGRAM_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    
    # Database
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()