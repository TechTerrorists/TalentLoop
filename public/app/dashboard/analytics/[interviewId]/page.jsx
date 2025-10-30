import InterviewAnalytics from "../../../components/InterviewAnalytics";

export default function AnalyticsPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <InterviewAnalytics interviewId={params.interviewId} />
    </div>
  );
}
