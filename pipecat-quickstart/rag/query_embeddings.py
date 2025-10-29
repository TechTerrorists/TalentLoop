from supabase_client import supabase
from generate_embeddings import get_embedding

def get_relevant_context(query: str, limit: int = 5):
    query_emb = get_embedding(query)
    response = supabase.rpc(
        "match_ai_contexts",
        {"query_embedding": query_emb, "match_limit": limit}
    ).execute()
    return response.data
