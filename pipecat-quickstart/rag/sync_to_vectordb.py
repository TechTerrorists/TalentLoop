from supabase import create_client
from generate_embeddings import get_embedding
from config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_data_for_rag():
    data_to_embed = []

    # --- JOB DATA ---
    jobs = supabase.table("Job").select("_id, title, description, company_id").execute().data
    for job in jobs:
        company = supabase.table("Company").select("name, industry").eq("_id", job["company_id"]).single().execute().data
        text = f"[Job] {job['title']} at {company['name']} ({company['industry']}): {job['description']}"
        data_to_embed.append(("job", job["_id"], text))

    # --- CANDIDATE INFO ---
    candidates = supabase.table("Candidate_Info").select("id, name, email, resumeurl, jobid").execute().data
    for cand in candidates:
        text = f"[Candidate] Name: {cand['name']}, Email: {cand['email']}, Resume: {cand['resumeurl']}"
        data_to_embed.append(("candidate", cand["id"], text))

    # --- INTERVIEWS ---
    interviews = supabase.table("interview").select("id, candidate_id, job_id, status").execute().data
    for iv in interviews:
        job = supabase.table("Job").select("title").eq("_id", iv["job_id"]).single().execute().data
        text = f"[interview] For job '{job['title']}' | Status: {iv['status']}"
        data_to_embed.append(("interview", iv["id"], text))

    # # --- REPORTS ---
    # reports = supabase.table("Report").select("id, feedback, recommendation, overallscore").execute().data
    # for rep in reports:
    #     text = f"[Report] Score: {rep['overallscore']} | Feedback: {rep['feedback']} | Recommendation: {rep['recommendation']}"
    #     data_to_embed.append(("report", rep["id"], text))

    # # --- SKILL SCORES ---
    # skills = supabase.table("Skill_Score").select("report_id, skill, score").execute().data
    # for s in skills:
    #     text = f"[Skill] {s['skill']}: {s['score']}/10"
    #     data_to_embed.append(("skill_score", s["report_id"], text))

    return data_to_embed


def sync_rag_table():
    """
    Fetches data from relational tables, generates embeddings, and inserts into ai_context.
    """
    records = fetch_data_for_rag()
    inserted = 0

    for (source, source_id, content) in records:
        emb = get_embedding(content)
        supabase.table("ai_context").insert({
            "source": source,
            "source_id": source_id,
            "content": content,
            "embedding": emb
        }).execute()
        inserted += 1

    return {"status": "success", "inserted_records": inserted}

sync_rag_table()