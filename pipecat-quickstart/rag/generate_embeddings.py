import google.generativeai as genai
from config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

def get_embedding(text: str):
    result = genai.embed_content(model="models/text-embedding-004", content=text)  # Gemini embedding model
    return result["embedding"]