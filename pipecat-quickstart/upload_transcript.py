from supabase import create_client, Client
from dotenv import load_dotenv
import os
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

with open('transcript.txt', 'r') as file:
    transcript = file.read()

response = supabase.table('transcripts').insert({'content': transcript}).execute()

if response.status_code == 200:
    print('Transcript uploaded successfully')
else:
    print('Failed to upload transcript')