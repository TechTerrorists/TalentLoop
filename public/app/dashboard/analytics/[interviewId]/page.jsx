"use client";
import InterviewAnalysisDetails from "../../../components/InterviewAnalysisDetails";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { use, useEffect, useState } from 'react';
import { interviewAPI } from '../../../../lib/api';
import { mockAnalysisData } from '../../../../lib/mockAnalysisData';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

export default function AnalyticsPage({ params }) {
  const { interviewId } = use(params);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch analysis data from API
        const response = await interviewAPI.getInterviewAnalysis(interviewId);
        setAnalysisData(response.data);
        setUsingMockData(false);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        console.log('Falling back to mock data for demonstration purposes');
        // Fall back to mock data for development/testing
        setAnalysisData(mockAnalysisData);
        setUsingMockData(true);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchAnalysis();
    }
  }, [interviewId]);

  return (
    <ProtectedRoute>
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IconArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interview analysis...</p>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto mt-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Analysis</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mock data notice */}
          {usingMockData && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <IconAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Demo Mode - Using Mock Data</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    The API endpoint is not available. Showing sample analysis data for demonstration.
                    Visit <a href="/demo-analysis" className="underline font-medium">/demo-analysis</a> to see all examples.
                  </p>
                </div>
              </div>
            </div>
          )}
          <InterviewAnalysisDetails analysisData={analysisData} />
        </>
      )}
    </ProtectedRoute>
  );
}
