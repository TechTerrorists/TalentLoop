import axios from 'axios';
import { auth } from './auth.js';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const authHeader = auth.getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export const interviewAPI = {
  listInterviews: async () => {
    const response = await api.get('/interviews/');
    return response.data;
  },

  createInterview: async (config) => {
    const response = await api.post('/interviews/', config);
    return response.data;
  },

  getInterview: async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}`);
    return response.data;
  },

  startInterview: async (sessionId) => {
    const response = await api.post(`/interviews/${sessionId}/start`);
    return response.data;
  },

  endInterview: async (sessionId) => {
    const response = await api.post(`/interviews/${sessionId}/end`);
    return response.data;
  },

  getInterviewAnalysis: async (interviewId) => {
    const response = await api.get(`/interview/${interviewId}/analysis`);
    return response;
  },
};