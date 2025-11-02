'use client';
import { MacbookScroll } from "./components/components/ui/macbook-scroll";
import { ExplainableAIApproach } from "./components/components/ui/explainable-ai-approach";
import { IconCaretRightFilled, IconSparkles, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          const startTime = Date.now();
          const startValue = 0;
          const endValue = parseInt(value.replace(/\D/g, ''));

          const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(startValue + (endValue - startValue) * progress);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, isVisible]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#D9EAFD] to-[#BCCCDC] relative overflow-hidden">
      {/* Animated background elements */}
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-gray-800 mb-4 leading-tight"
          >
            Everything
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-800"
            >
              for your interviews
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 mt-6"
          >
            TalentLoop, an AI-powered platform, serves as an all-in-one solution for interview practice, skill development, and performance tracking.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-200 via-gray-100 to-orange-300 text-gray-900 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <IconCaretRightFilled className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </motion.a>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:block"
          >
            <MacbookScroll
              showGradient={true}
              firstImage={`/screenshots/image1.png`}
              secondImage={`/screenshots/image2.png`}
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Explainable AI Approach Section */}
      <ExplainableAIApproach />
      
      {/* Features Grid */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20"
        >
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ),
              title: "AI Avatar Interviews",
              description: "Practice with realistic AI-powered avatars that simulate real interview scenarios with natural conversation flow."
            },
            {
              icon: (
                <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Real-Time Feedback",
              description: "Get instant, comprehensive feedback and scoring to help you improve your interview performance immediately."
            },
            {
              icon: (
                <svg className="w-8 h-8 text-[#9AA6B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              ),
              title: "Multi-Language Support",
              description: "Practice interviews in multiple languages with voice recognition and synthesis capabilities."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-white/50 group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 bg-gradient-to-br from-[#D9EAFD] to-[#BCCCDC] rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-[#9AA6B2] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/50"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "10,000+", label: "Interviews Conducted", icon: <IconUsers className="w-8 h-8" /> },
              { value: "95%", label: "Success Rate", icon: <IconTrendingUp className="w-8 h-8" /> },
              { value: "24/7", label: "Available", icon: <IconSparkles className="w-8 h-8" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D9EAFD] to-[#BCCCDC] rounded-full flex items-center justify-center mb-4 text-[#9AA6B2]">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.value.includes('+') ? (
                    <>
                      <AnimatedCounter value={stat.value.replace('+', '')} suffix="+" />
                    </>
                  ) : stat.value.includes('%') ? (
                    <>
                      <AnimatedCounter value={stat.value.replace('%', '')} suffix="%" />
                    </>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-orange-200/20 rounded-3xl blur-3xl -z-10" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            Ready to Ace Your Next Interview?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of successful candidates who have improved their
            interview skills with TalentLoop.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BCCCDC] to-[#9AA6B2] hover:from-[#9AA6B2] hover:to-[#BCCCDC] text-white px-12 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group"
          >
            <span className="relative z-10">Start Your First Interview</span>
            <IconCaretRightFilled className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.a>
        </motion.div>
      </div>
    </div>
    
  );
}
