'use client';

import { useState, useEffect } from 'react';
import { interviewAPI } from '../lib/api.js';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const data = await interviewAPI.listInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const config = {
        candidate_id: 1,
        company_id: 1,
        job_id: 1,
        language: "en",
        avatar_enabled: true
      };
      
      const newSession = await interviewAPI.createInterview(config);
      const startResponse = await interviewAPI.startInterview(newSession.id);
      setSession({...newSession, bot_url: startResponse.bot_url, status: 'in_progress'});
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Avatar Interview System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practice interviews with our AI-powered avatar. Get real-time feedback and improve your skills.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {interviews.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Interviews</h2>
              <div className="space-y-2">
                {interviews.slice(0, 5).map((interview) => (
                  <div key={interview.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <span className="font-medium">Interview #{interview.id}</span>
                      <span className="ml-4 text-sm text-gray-600 dark:text-gray-300">
                        Status: {interview.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!session ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Ready to Start Your Interview?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Features:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Real-time AI conversation</li>
                    <li>• Voice recognition & synthesis</li>
                    <li>• Comprehensive scoring</li>
                    <li>• Multi-language support</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={startInterview}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    {loading ? 'Starting...' : 'Start Interview'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Interview Session</h2>
              <div className="text-center space-y-4">
                <p>Session ID: {session.id}</p>
                <p>Status: <span className="capitalize font-medium">{session.status}</span></p>
                <p>Job ID: {session.job_id}</p>
                {session.bot_url ? (
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mt-6">
                    <p className="font-semibold mb-2">Pipecat Bot Ready</p>
                    <a href={session.bot_url} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-300 hover:underline">
                      {session.bot_url}
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Click to connect to your AI interviewer
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bot URL not available yet. Please wait...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
