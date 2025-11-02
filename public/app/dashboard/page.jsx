'use client';

import { useState, useEffect } from 'react';
import { interviewAPI } from '../../lib/api.js';
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconMicrophone, 
  IconChartBar, 
  IconLanguage, 
  IconBrain,
  IconPlayerPlay,
  IconClock,
  IconX,
  IconExternalLink,
  IconCalendar,
  IconCheck,
  IconLoader2
} from "@tabler/icons-react";
    
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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <IconCheck className="w-4 h-4" />;
      case 'in_progress': return <IconLoader2 className="w-4 h-4 animate-spin" />;
      default: return <IconClock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#D9EAFD] to-[#BCCCDC] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 20,
            y: mousePosition.y / 20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            AI Avatar Interview System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-2xl mx-auto"
          >
            Practice interviews with our AI-powered avatar. Get real-time
            feedback and improve your skills.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          {interviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {[
                { label: 'Total Interviews', value: interviews.length, icon: <IconChartBar className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
                { label: 'Completed', value: interviews.filter(i => i.status === 'completed').length, icon: <IconCheck className="w-6 h-6" />, color: 'from-green-400 to-green-600' },
                { label: 'In Progress', value: interviews.filter(i => i.status === 'in_progress').length, icon: <IconLoader2 className="w-6 h-6" />, color: 'from-orange-400 to-orange-600' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Recent Interviews */}
          {interviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Interviews
                </h2>
                <div className="text-sm text-gray-600">{interviews.length} total</div>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {interviews.slice(0, 5).map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#D9EAFD]/50 to-white rounded-xl hover:shadow-lg transition-all border border-gray-200/50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(interview.status)} border-2`}>
                            {getStatusIcon(interview.status)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 mb-1">
                              Interview #{interview.id}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)} border`}>
                                {interview.status || 'Pending'}
                              </span>
                              <span className="flex items-center gap-1">
                                <IconCalendar className="w-3 h-3" />
                                {new Date(interview.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/analytics/${interview.id}`}
                          className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#BCCCDC] to-[#9AA6B2] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all group-hover:scale-105"
                        >
                          View Analysis
                          <IconExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {!session ? (
              <motion.div
                key="start-session"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/50"
              >
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold mb-3 text-gray-800"
                  >
                    Ready to Start Your Interview?
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-gray-600"
                  >
                    Practice with our AI-powered avatar and get instant feedback
                  </motion.p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Features:
                    </h3>
                    {[
                      { icon: <IconMicrophone className="w-6 h-6" />, text: "Real-time AI conversation", color: "from-blue-400 to-blue-600" },
                      { icon: <IconBrain className="w-6 h-6" />, text: "Voice recognition & synthesis", color: "from-purple-400 to-purple-600" },
                      { icon: <IconChartBar className="w-6 h-6" />, text: "Comprehensive scoring", color: "from-green-400 to-green-600" },
                      { icon: <IconLanguage className="w-6 h-6" />, text: "Multi-language support", color: "from-orange-400 to-orange-600" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200/50"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                          {feature.icon}
                        </div>
                        <span className="text-gray-700 font-medium">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startInterview}
                      disabled={loading}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#BCCCDC] via-[#9AA6B2] to-[#BCCCDC] disabled:opacity-50 text-white px-10 py-5 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {loading ? (
                          <>
                            <IconLoader2 className="w-6 h-6 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <IconPlayerPlay className="w-6 h-6" />
                            Start Interview
                          </>
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      />
                    </motion.button>
                    {loading && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-sm text-gray-600"
                      >
                        Setting up your interview session...
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active-session"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/50"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-bold text-gray-800 mb-2"
                    >
                      Interview Session Active
                    </motion.h2>
                    <p className="text-gray-600">Your interview is ready to begin</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSession(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  >
                    <IconX className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Session Info Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
                    >
                      <div className="text-sm text-blue-600 font-medium mb-1">Session ID</div>
                      <div className="text-lg font-bold text-blue-900">#{session.id}</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`rounded-xl p-4 border ${getStatusColor(session.status)}`}
                    >
                      <div className="text-sm font-medium mb-1">Status</div>
                      <div className="flex items-center gap-2 text-lg font-bold capitalize">
                        {getStatusIcon(session.status)}
                        {session.status}
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
                    >
                      <div className="text-sm text-purple-600 font-medium mb-1">Job ID</div>
                      <div className="text-lg font-bold text-purple-900">#{session.job_id}</div>
                    </motion.div>
                  </div>

                  {/* Bot URL Card */}
                  {session.bot_url ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <IconCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-lg">Pipecat Bot Ready</div>
                          <div className="text-sm text-gray-600">Your AI interviewer is waiting</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={session.bot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 flex-1 justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all group"
                        >
                          Connect to Interview
                          <IconExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            await interviewAPI.endInterview(session.id);
                            setSession(null);
                            loadInterviews();
                          }}
                          className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
                        >
                          End Interview
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-600 mt-3 text-center break-all">
                        {session.bot_url}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200"
                    >
                      <div className="flex items-center gap-3">
                        <IconLoader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                        <div>
                          <div className="font-semibold text-gray-800">Bot URL not available yet</div>
                          <div className="text-sm text-gray-600">Please wait while we set up your interview...</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
      
  );
}
