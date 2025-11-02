"use client";
import Image from "next/image";

export const ExplainableAIApproach = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
        {/* Left Column - Text Content */}
        <div className="space-y-6">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Our AI Approach
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At TalentLoop, we build Explainable AI to bring the most transparent
            and user-friendly smart hiring solution to your company. We help
            recruitment teams to identify desirable candidates during the entire
            talent acquisition process. An Explainable AI approach allows to
            highlight candidates' key performance factors and minimize the risk
            of making biased decisions.
          </p>
        </div>

        {/* Right Column - Diagram */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8">
          <Image
            src="/screenshots/image.png"
            alt="Explainable AI Approach Diagram"
            width={600}
            height={600}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
};
