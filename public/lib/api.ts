import axios from 'axios';
import { InterviewConfig, InterviewSession } from '../types/interview';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const interviewAPI = {
  createInterview: async (config: InterviewConfig): Promise<InterviewSession> => {
    const response = await api.post('/interviews/', config);
    return response.data;
  },

  getInterview: async (sessionId: string): Promise<InterviewSession> => {
    const response = await api.get(`/interviews/${sessionId}`);
    return response.data;
  },

  startInterview: async (sessionId: string) => {
    const response = await api.post(`/interviews/${sessionId}/start`);
    return response.data;
  },

  endInterview: async (sessionId: string) => {
    const response = await api.post(`/interviews/${sessionId}/end`);
    return response.data;
  },
};