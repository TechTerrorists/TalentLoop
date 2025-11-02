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
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      {/* Overall Score */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Interview Analysis</h2>
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
          <span className="text-4xl font-bold text-white">
            {analysis.overall_score}
          </span>
        </div>
        <p className="mt-4 text-lg font-semibold capitalize">
          Recommendation: {analysis.recommendation}
        </p>
      </div>

      {/* Skill Scores */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Skill Assessment</h3>
        <div className="space-y-3">
          {analysis.skill_scores.map((skill, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{skill.skill}</span>
                <span className="text-gray-600">{skill.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    skill.score >= 70
                      ? "bg-green-500"
                      : skill.score >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${skill.score}%` }}
                ></div>
              </div>
              {skill.evidence && (
                <p className="text-sm text-gray-600 mt-1 italic">
                  "{skill.evidence}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      {analysis.sentiment && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Sentiment</h4>
            <p className="capitalize">{analysis.sentiment.overall_sentiment}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Confidence</h4>
            <p className="capitalize">{analysis.sentiment.confidence_level}</p>
          </div>
        </div>
      )}

      {/* Key Strengths */}
      {analysis.key_strengths?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Key Strengths</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {analysis.key_strengths.map((strength, idx) => (
              <li key={idx}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {analysis.areas_for_improvement?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {analysis.areas_for_improvement.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Feedback */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Detailed Feedback</h3>
        <p className="text-gray-700 whitespace-pre-line">{analysis.feedback}</p>
      </div>
    </div>
  );
}
