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
        
        // Fetch from Supabase directly
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Get report data
        const { data: reportData, error: reportError } = await supabase
          .from('Report')
          .select('*')
          .eq('interview_id', interviewId);
        
        if (reportError) throw reportError;
        if (!reportData || reportData.length === 0) throw new Error('No analysis found');
        
        const report = reportData[0];
        
        // Get skill scores
        const { data: skillScores } = await supabase
          .from('skill score')
          .select('*')
          .eq('interview_id', interviewId);
        
        // Format data to match InterviewAnalysisDetails structure
        setAnalysisData({
          evaluation_summary: {
            overall_score: report.overallscore || 0,
            recommendation: report.recommendation || 'N/A',
            overall_summary: report.areasOfImprovement || 'Analysis completed',
            recommendation_rationale: report.areasOfImprovement || 'Based on interview performance'
          },
          detailed_scoring: [
            {
              category: 'Communication',
              description: 'Clarity and effectiveness of communication',
              score: report.communication || 0,
              rationale: 'Assessment based on verbal communication skills',
              evidence: report.evidence?.filter(e => e.category === 'Communication').map(e => e.quote) || []
            },
            {
              category: 'Professionalism',
              description: 'Professional conduct and demeanor',
              score: report.professionalism || 0,
              rationale: 'Assessment based on professional behavior',
              evidence: []
            },
            {
              category: 'Positive Attitude',
              description: 'Enthusiasm and positive engagement',
              score: report.positiveAttitude || 0,
              rationale: 'Assessment based on attitude and engagement',
              evidence: []
            },
            {
              category: 'Technical Depth',
              description: 'Technical knowledge and expertise',
              score: report.technicalDepth || 0,
              rationale: 'Assessment based on technical competency',
              evidence: report.evidence?.filter(e => e.category === 'Technical Depth').map(e => e.quote) || []
            },
            {
              category: 'Response Quality',
              description: 'Quality and relevance of responses',
              score: report.responseQuality || 0,
              rationale: 'Assessment based on answer quality',
              evidence: []
            }
          ],
          qualitative_analysis: {
            key_strengths: Array.isArray(report.keyStrengths) ? report.keyStrengths : [],
            areas_for_improvement: report.areasOfImprovement ? report.areasOfImprovement.split(',').map(s => s.trim()) : []
          }
        });
        setUsingMockData(false);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err.message);
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
          {/* Mock data notice
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
            </div> */}
          {/* )} */}
          <InterviewAnalysisDetails analysisData={analysisData} />
        </>
      )}
    </ProtectedRoute>
  );
}
