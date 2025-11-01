'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#D9EAFD] to-[#BCCCDC]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-gray-800">TalentLoop</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Transform your interview experience with AI-powered avatar technology.
            Practice, improve, and ace your next interview.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/dashboard"
              className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Get Started
            </a>
            <button className="bg-[#F8FAFC] hover:bg-[#D9EAFD] text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg border border-[#BCCCDC]">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="bg-[#F8FAFC] rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#D9EAFD] rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">AI Avatar Interviews</h3>
            <p className="text-gray-700">
              Practice with realistic AI-powered avatars that simulate real interview scenarios with natural conversation flow.
            </p>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#D9EAFD] rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Real-Time Feedback</h3>
            <p className="text-gray-700">
              Get instant, comprehensive feedback and scoring to help you improve your interview performance immediately.
            </p>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#D9EAFD] rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Multi-Language Support</h3>
            <p className="text-gray-700">
              Practice interviews in multiple languages with voice recognition and synthesis capabilities.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-[#F8FAFC] rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">10,000+</div>
              <div className="text-gray-700">Interviews Conducted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">95%</div>
              <div className="text-gray-700">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">24/7</div>
              <div className="text-gray-700">Available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who have improved their interview skills with TalentLoop.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Start Your First Interview
          </a>
        </div>
      </div>
    </div>
  );
}
