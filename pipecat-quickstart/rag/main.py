from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from query_embeddings import get_relevant_context
from sync_to_vectordb import sync_rag_table

app = FastAPI(title="TalentLoop RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get_context")
async def get_context(query: str = Query(...), limit: int = 5):
    """
    Retrieve relevant context for a user query from vector DB.
    """
    results = get_relevant_context(query, limit)
    return {"results": results}



@app.post("/sync_rag")
async def sync_rag():
    """
    Fetches data from normal tables and inserts embeddings into ai_context.
    Useful for manual refresh or background cron jobs.
    """
    result = sync_rag_table()
    return {"message": "RAG database synced successfully", "details": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="8001")