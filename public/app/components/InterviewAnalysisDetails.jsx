'use client';

import { useEffect, useState } from 'react';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconQuote,
  IconStar,
  IconBriefcase,
  IconMessageCircle,
  IconBulb,
  IconTools,
  IconClipboardCheck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Score visualization component
const ScoreCircle = ({ score, size = 120 }) => {
  const isNA = score === 'N/A' || score === null;
  const numericScore = isNA ? 0 : parseInt(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  const getScoreColor = (score) => {
    if (isNA) return '#9CA3AF';
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#EF4444';
    return '#DC2626';
  };

  const getScoreLabel = (score) => {
    if (isNA) return 'N/A';
    if (score >= 90) return 'Exceptional';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Acceptable';
    if (score >= 40) return 'Weak';
    return 'Not a Fit';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke={getScoreColor(numericScore)}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold" style={{ color: getScoreColor(numericScore) }}>
          {isNA ? 'N/A' : numericScore}
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {getScoreLabel(numericScore)}
        </div>
      </div>
    </div>
  );
};

// Recommendation badge component
const RecommendationBadge = ({ recommendation }) => {
  const getBadgeStyle = (rec) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Hire':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Reject':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getIcon = (rec) => {
    switch (rec) {
      case 'Strong Hire':
      case 'Hire':
        return <IconCheck className="w-5 h-5" />;
      case 'Reject':
        return <IconX className="w-5 h-5" />;
      default:
        return <IconAlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-lg ${getBadgeStyle(recommendation)}`}
    >
      {getIcon(recommendation)}
      {recommendation}
    </motion.div>
  );
};

// Evidence quote component
const EvidenceQuote = ({ quote, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-6 pr-4 py-3 bg-gray-50 rounded-lg border-l-4 border-blue-400"
  >
    <IconQuote className="absolute top-3 left-2 w-4 h-4 text-blue-400 opacity-50" />
    <p className="text-sm text-gray-700 italic">{quote}</p>
  </motion.div>
);

// Category score card component
const CategoryScoreCard = ({ category, description, score, rationale, evidence, index }) => {
  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Communication':
        return <IconMessageCircle className="w-6 h-6" />;
      case 'Professionalism':
        return <IconBriefcase className="w-6 h-6" />;
      case 'Positive Attitude':
        return <IconStar className="w-6 h-6" />;
      case 'Technical Depth':
        return <IconTools className="w-6 h-6" />;
      case 'Response Quality':
        return <IconClipboardCheck className="w-6 h-6" />;
      default:
        return <IconBulb className="w-6 h-6" />;
    }
  };

  const getScoreBarColor = (score) => {
    if (score === 'N/A' || score === null) return 'bg-gray-400';
    const numericScore = parseInt(score);
    if (numericScore >= 90) return 'bg-green-500';
    if (numericScore >= 75) return 'bg-blue-500';
    if (numericScore >= 60) return 'bg-yellow-500';
    if (numericScore >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isNA = score === 'N/A' || score === null;
  const numericScore = isNA ? 0 : parseInt(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              {getCategoryIcon(category)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{category}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ScoreCircle score={score} size={90} />
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${isNA ? 0 : numericScore}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full ${getScoreBarColor(score)}`}
            />
          </div>
        </div>

        {/* Rationale */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Assessment</h4>
          <p className="text-gray-700 leading-relaxed">{rationale}</p>
        </div>

        {/* Evidence */}
        {evidence && evidence.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <IconQuote className="w-4 h-4" />
              Supporting Evidence
            </h4>
            <div className="space-y-2">
              {evidence.map((quote, idx) => (
                <EvidenceQuote key={idx} quote={quote} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main component
export default function InterviewAnalysisDetails({ analysisData }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(analysisData);
  }, [analysisData]);

  if (!data || !data.evaluation_summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const { evaluation_summary, detailed_scoring = [], qualitative_analysis = {} } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Analysis Report</h1>
          <p className="text-gray-600">Comprehensive evaluation based on interview transcript</p>
        </motion.div>

        {/* Overall Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Score */}
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Score</h2>
              <ScoreCircle score={evaluation_summary.overall_score} size={160} />
              <p className="mt-6 text-gray-700 leading-relaxed max-w-md">
                {evaluation_summary.overall_summary}
              </p>
            </div>

            {/* Right: Recommendation */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommendation</h2>
              <div className="mb-6">
                <RecommendationBadge recommendation={evaluation_summary.recommendation} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Rationale</h3>
                <p className="text-gray-700 leading-relaxed">
                  {evaluation_summary.recommendation_rationale}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Scoring Section */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Detailed Assessment
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {detailed_scoring?.map((category, index) => (
              <CategoryScoreCard
                key={index}
                {...category}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Qualitative Analysis Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <IconTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Key Strengths</h3>
            </div>
            <ul className="space-y-3">
              {qualitative_analysis?.key_strengths?.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <IconTrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {qualitative_analysis?.areas_for_improvement?.map((area, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <IconAlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{area}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>This analysis is generated using AI and should be used as part of a comprehensive evaluation process.</p>
        </motion.div>
      </div>
    </div>
  );
}