from supabase import create_client
from generate_embeddings import get_embedding
from config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_relevant_context(query: str, limit: int = 5):
    query_emb = get_embedding(query)
    response = supabase.rpc(
        "match_ai_contexts",
        {"query_embedding": query_emb, "match_limit": limit}
    ).execute()
    return response.data
