"use server";
import InterviewAnalytics from "../../../components/InterviewAnalytics";

export default async function AnalyticsPage({ params }) {
  const { interviewId } = await params;

  return (
    <div className="container mx-auto py-8">
      <InterviewAnalytics interviewId={interviewId} />
    </div>
  );
}
