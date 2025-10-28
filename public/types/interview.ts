export interface InterviewSession {
  id: string;
  candidate_id: string;
  job_position: string;
  interview_type: 'practice' | 'real' | 'voice_only';
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface InterviewConfig {
  job_description: string;
  required_skills: string[];
  language: string;
  avatar_enabled: boolean;
}