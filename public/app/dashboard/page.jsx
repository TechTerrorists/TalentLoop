'use client';

import { useState, useEffect } from 'react';
import { interviewAPI } from '../../lib/api.js';
import Link from "next/link";

export default function Dashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#D9EAFD] to-[#BCCCDC]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Avatar Interview System
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Practice interviews with our AI-powered avatar. Get real-time
            feedback and improve your skills.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {interviews.length > 0 && (
            <div className="bg-[#F8FAFC] rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Interviews
              </h2>
              <div className="space-y-2">
                {interviews.slice(0, 5).map((interview) => (
                  <div
                    key={interview.id}
                    className="flex justify-between items-center p-3 bg-[#D9EAFD] rounded"
                  >
                    <div>
                      <span className="font-medium text-gray-700">
                        Interview #{interview.id}
                      </span>
                      <span className="ml-4 text-sm text-gray-700">
                        Status: {interview.status}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/analytics/${interview.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Analysis
                    </Link>
                    <span className="text-sm text-gray-700">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!session ? (
            <div className="bg-[#F8FAFC] rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Ready to Start Your Interview?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Features:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
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
                    className="bg-[#BCCCDC] hover:bg-[#9AA6B2] disabled:opacity-50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    {loading ? "Starting..." : "Start Interview"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Interview Session
              </h2>
              <div className="text-center space-y-4">
                <p className="text-gray-700">Session ID: {session.id}</p>
                <p className="text-gray-700">
                  Status:{" "}
                  <span className="capitalize font-medium">
                    {session.status}
                  </span>
                </p>
                <p className="text-gray-700">Job ID: {session.job_id}</p>
                {session.bot_url ? (
                  <div className="bg-[#D9EAFD] rounded-lg p-6 mt-6">
                    <p className="font-semibold mb-2 text-gray-700">
                      Pipecat Bot Ready
                    </p>
                    <a
                      href={session.bot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#BCCCDC] hover:underline"
                    >
                      {session.bot_url}
                    </a>
                    <p className="text-sm text-gray-700 mt-2">
                      Click to connect to your AI interviewer
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#D9EAFD] rounded-lg p-6 mt-6">
                    <p className="text-sm text-gray-700">
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
