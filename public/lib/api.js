import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};