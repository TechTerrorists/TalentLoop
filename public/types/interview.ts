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

export interface InterviewScore {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  sentimentAnalysis: Record<string, any>;
  voiceAnalysis: Record<string, any>;
}

export interface InterviewResult {
  sessionId: string;
  score: InterviewScore;
  transcript: string;
  feedback: string;
  recommendations: string[];
}

export interface WebRTCRoom {
  roomId: string;
  roomUrl: string;
  token: string;
}