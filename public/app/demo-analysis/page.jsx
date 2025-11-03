'use client';

import { useState } from 'react';
import InterviewAnalysisDetails from '../components/InterviewAnalysisDetails';
import { mockAnalysisData, mockExceptionalCandidate, mockWeakCandidate } from '../../lib/mockAnalysisData';
import { IconUser, IconUserCheck, IconUserX } from '@tabler/icons-react';

export default function DemoAnalysisPage() {
  const [selectedCandidate, setSelectedCandidate] = useState('good');

  const candidateOptions = [
    { id: 'good', label: 'Good Candidate (Hire)', data: mockAnalysisData, icon: IconUser, color: 'blue' },
    { id: 'exceptional', label: 'Exceptional Candidate (Strong Hire)', data: mockExceptionalCandidate, icon: IconUserCheck, color: 'green' },
    { id: 'weak', label: 'Weak Candidate (Reject)', data: mockWeakCandidate, icon: IconUserX, color: 'red' }
  ];

  const currentData = candidateOptions.find(opt => opt.id === selectedCandidate)?.data;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with selector */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Analysis Demo</h1>
              <p className="text-gray-600 mt-1">Compare different candidate evaluation examples</p>
            </div>

            {/* Candidate selector */}
            <div className="flex gap-2">
              {candidateOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedCandidate === option.id;
                const colorClasses = {
                  blue: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                  green: isSelected ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
                  red: isSelected ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                };

                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCandidate(option.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${colorClasses[option.color]} ${
                      isSelected ? 'shadow-lg scale-105' : 'shadow hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis content */}
      <InterviewAnalysisDetails analysisData={currentData} />
    </div>
  );
}
