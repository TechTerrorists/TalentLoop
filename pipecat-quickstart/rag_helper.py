import os
import httpx

RAG_API_URL = os.getenv("RAG_API_URL", "http://localhost:8001")

async def get_interview_context(job_id: int, candidate_id: int, company_id: int):
    """Fetch relevant context from RAG for interview"""
    try:
        async with httpx.AsyncClient() as client:
            # Get job context
            job_response = await client.get(
                f"{RAG_API_URL}/get_context",
                params={"query": f"job {job_id}", "limit": 2}
            )
            job_context = job_response.json().get("results", [])
            
            # Get candidate context
            candidate_response = await client.get(
                f"{RAG_API_URL}/get_context",
                params={"query": f"candidate {candidate_id}", "limit": 2}
            )
            candidate_context = candidate_response.json().get("results", [])
            
            # Combine contexts
            context_text = "\n".join([
                item.get("content", "") 
                for item in job_context + candidate_context
            ])
            
            return context_text
    except Exception as e:
        print(f"RAG fetch error: {e}")
        return ""
