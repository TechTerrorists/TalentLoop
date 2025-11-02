import os
from dotenv import load_dotenv
from supabase import create_client, Client
 
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# with open('trialTranscript.txt', 'r') as f:
#     transcript_content = f.read()
                
# interview_id = int(os.getenv("INTERVIEW_ID", "39"))
# supabase.table('Interview_Transcript').insert({
#                     'interview_id': interview_id,
#                     'transcript_data': transcript_content
#                 }).execute()

# companydetails=supabase.table("Company").select("*").eq("_id",1).execute()
# jobdetails=supabase.table("Job").select("*,Job_Requirements(*)").eq("_id",2).execute()
# jobRequirements = jobdetails.data[0]["Job_Requirements"]
# candidatedetails=supabase.table("Candidate_Info").select("*").eq("id",2).execute()

# print(jobRequirements)
# skills = ""
# for i in jobRequirements:
#     skill = i['skill']
#     skills += skill + ", "

# print(skills)

# print(candidatedetails.data[0]['name'])
