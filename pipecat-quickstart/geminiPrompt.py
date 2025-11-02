import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()


GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

with open("trialTranscript.txt", "r") as file:
    transcript = file.read()
    response = model.generate_content(f"""
You are a meticulous and objective Senior Hiring Manager. Your analysis is expert-level, precise, and based only on the provided information. You must be "very very very very accurate," meaning every score and qualitative statement you make must be directly and explicitly supported by evidence from the transcript.

Your task is to analyze the provided interview transcript against the job's specific requirements.

1. Context (You MUST provide this)
Job Role: [USER, INSERT JOB TITLE, e.g., "Senior Data Scientist"]

Job Level: [USER, INSERT JOB LEVEL, e.g., "L5 / Senior"]

Key Competencies: [USER, LIST 3-5 CRITICAL SKILLS, e.g., "1. Python (Pandas, Scikit-learn), 2. Advanced SQL, 3. Communication with non-technical stakeholders, 4. A/B Testing, 5. Proactivity"]

Interview Transcript: {transcript}

2. Evaluation Instructions
Baseline: First, read the Job Role, Level, and Key Competencies to create your baseline standard. All scores must be relative to this standard.

Scoring Rubric (0-100): You must use this scale for all scores.

90-100 (Exceptional): Exceeds expectations for this level. Masterful.

75-89 (Strong): Meets all expectations and exceeds some. Strong hire.

60-74 (Acceptable): Meets the minimum bar for the role. May have minor gaps.

40-59 (Weak): Fails to meet key expectations for the role level.

0-39 (Not a Fit): Demonstrates a fundamental lack of the required skills.

N/A: If the transcript provides zero evidence to evaluate a category, use "N/A" and explain why (e.g., "The topic of 'Positive Attitude' never came up").

Evidence: The evidence array for each category is mandatory. Pull 1-3 direct, verbatim quotes from the transcript that directly justify the score you gave.

No Assumptions: Do not infer or assume anything not explicitly stated in the transcript.

3. Required JSON Output Structure
Return only a single, valid JSON object with the following nested structure. Do not include any text before or after the JSON.

JSON

{
  "evaluation_summary": {
    "overall_score": "<number (0-100 or 'N/A')>",
    "overall_summary": "<string (A 2-3 sentence holistic summary of the candidate's performance, balancing all categories)>",
    "recommendation": "<string (Choose one: 'Strong Hire', 'Hire', 'Maybe', 'Reject')>",
    "recommendation_rationale": "<string (The single most critical reason for your recommendation, referencing the Key Competencies)>"
  },
  "detailed_scoring": [
    {
      "category": "Communication",
      "description": "Clarity, articulation, coherence, and professional language. Was the candidate easy to understand and articulate?",
      "score": "<number (0-100 or 'N/A')>",
      "rationale": "<string (Explain *why* you gave this score, referencing clarity, tone, etc.)>",
      "evidence": [
        "<string (Direct quote from transcript supporting this score)>",
        "<string (Another supporting quote, if available)>"
      ]
    },
    {
      "category": "Professionalism",
      "description": "Tone, language, and overall demeanor. Assesses fit for a professional environment.",
      "score": "<number (0-100 or 'N/A')>",
      "rationale": "<string (Explain *why* you gave this score, referencing tone, respect, and preparedness.)>",
      "evidence": [
        "<string (Direct quote from transcript supporting this score)>"
      ]
    },
    {
      "category":Details": "Positive Attitude",
      "description": "Enthusiasm for the role, demonstration of a growth mindset, and constructive response to challenges or feedback.",
      "score": "<number (0-100 or 'N/A')>",
      "rationale": "<string (Explain *why* you gave this score, referencing their apparent enthusiasm, curiosity, or mindset.)>",
      "evidence": [
        "<string (Direct quote from transcript supporting this score)>"
      ]
    },
    {
      "category": "Technical Depth",
      "description": "Correctness, depth, and nuance of technical reasoning, *relative to the specific Job Role and Level*. How well do they know their craft?",
      "score": "<number (0-100 or 'N/A')>",
      "rationale": "<string (Explain *why* you gave this score, referencing specific technical topics from the 'Key Competencies'.)>",
      "evidence": [
        "<string (A quote demonstrating strong or weak technical knowledge)>",
        "<string (Another technical quote, if available)>"
      ]
    },
    {
      "category": "Response Quality",
      "description": "Depth, clarity, and *relevance* of answers. Did they directly answer the question asked, or did they evade? Were answers structured (e.g., STAR method) or rambling?",
      "score": "<number (0-100 or 'N/A')>",
      "rationale": "<string (Explain *why* you gave this score, focusing on answer structure, relevance, and depth.)>",
      "evidence": [
        "<string (A quote showing a very relevant and deep answer, or a very evasive one)>"
      ]
    }
  ],
  "qualitative_analysis": {
    "key_strengths": [
      "<string (A specific, evidence-based strength, e.g., 'Deep knowledge of Python Pandas, as shown by their answer on dataframes...')>",
      "<string (Another specific strength)>"
    ],
    "areas_for_improvement": [
      "<string (A specific, actionable suggestion for growth, e.g., 'Needs to structure behavioral answers more clearly; often rambled...')>",
      "<string (Another specific area for improvement)>"
    ]
  }
}""")
    print(type(response.text))
