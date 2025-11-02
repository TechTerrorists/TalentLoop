"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function InterviewAnalytics({ interviewId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [interviewId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/interview/${interviewId}/analysis`
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading analysis: {error}</p>
      </div>
    );
  }

  if (!analysis) {
    return <div>No analysis available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#D9EAFD] to-[#BCCCDC] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overall Score */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Interview Analysis</h2>
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r from-[#BCCCDC] to-[#9AA6B2] shadow-xl">
              <span className="text-5xl font-bold text-white">
                {analysis.overall_score}
              </span>
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-800">
              Recommendation: <span className="text-[#BCCCDC]">{analysis.recommendation}</span>
            </p>
          </div>
        </div>

        {/* Skill Scores */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Skill Assessment</h3>
          <div className="space-y-4">
            {analysis.skill_scores.map((skill, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-800">{skill.skill}</span>
                  <span className="text-[#BCCCDC] font-bold">{skill.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      skill.score >= 70
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : skill.score >= 40
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>
                {skill.evidence && (
                  <p className="text-sm text-gray-600 italic bg-white p-3 rounded border-l-4 border-[#BCCCDC]">
                    "{skill.evidence}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        {analysis.sentiment && Object.keys(analysis.sentiment).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Sentiment Analysis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold mb-3 text-blue-800">Sentiment</h4>
                <p className="capitalize text-lg font-semibold text-blue-900">{analysis.sentiment.overall_sentiment}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h4 className="font-bold mb-3 text-purple-800">Confidence</h4>
                <p className="capitalize text-lg font-semibold text-purple-900">{analysis.sentiment.confidence_level}</p>
              </div>
            </div>
          </div>
        )}

        {/* Key Strengths & Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          {analysis.key_strengths?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.key_strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysis.areas_for_improvement?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {analysis.areas_for_improvement.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Detailed Feedback */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Detailed Feedback</h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{analysis.feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
