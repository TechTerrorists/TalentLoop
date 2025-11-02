"use client";
import InterviewAnalytics from "../../../components/InterviewAnalytics";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { use } from 'react';

export default function AnalyticsPage({ params }) {
  const { interviewId } = use(params);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <InterviewAnalytics interviewId={interviewId} />
      </div>
    </ProtectedRoute>
  );
}
