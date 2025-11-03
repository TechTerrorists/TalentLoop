// Mock data for testing the Interview Analysis Details component
export const mockAnalysisData = {
  evaluation_summary: {
    overall_score: 78,
    overall_summary: "The candidate demonstrates strong technical skills and excellent communication abilities. While they show good professionalism and positive attitude, there are opportunities to improve depth in some technical areas and response structure.",
    recommendation: "Hire",
    recommendation_rationale: "Strong technical foundation combined with excellent soft skills makes this candidate a good fit for the Senior Data Scientist role. Minor gaps in advanced SQL can be addressed through on-the-job learning."
  },
  detailed_scoring: [
    {
      category: "Communication",
      description: "Clarity, articulation, coherence, and professional language. Was the candidate easy to understand and articulate?",
      score: 85,
      rationale: "The candidate communicated complex technical concepts clearly and concisely. Their explanations were well-structured and easy to follow, demonstrating strong verbal communication skills suitable for cross-functional collaboration.",
      evidence: [
        "When explaining machine learning models, I always start by understanding the business problem first, then translate that into technical requirements.",
        "I make sure to use analogies when talking to non-technical stakeholders. For example, I compared A/B testing to trying two different recipes to see which one tastes better."
      ]
    },
    {
      category: "Professionalism",
      description: "Tone, language, and overall demeanor. Assesses fit for a professional environment.",
      score: 82,
      rationale: "The candidate maintained a professional tone throughout the interview, showed respect and attentiveness, and demonstrated good preparation. They asked thoughtful questions and showed genuine interest in the role and company.",
      evidence: [
        "I've reviewed your company's recent blog posts on data science initiatives and I'm really excited about your approach to ethical AI.",
        "Thank you for that question. Let me think through my response carefully to give you a complete answer."
      ]
    },
    {
      category: "Positive Attitude",
      description: "Enthusiasm for the role, demonstration of a growth mindset, and constructive response to challenges or feedback.",
      score: 88,
      rationale: "The candidate showed exceptional enthusiasm and a strong growth mindset. They spoke positively about challenges, demonstrated curiosity about learning new technologies, and showed genuine excitement about the opportunity.",
      evidence: [
        "I actually love tackling difficult problems. When I encountered performance issues in my last project, I saw it as an opportunity to deep-dive into optimization techniques.",
        "I'm always looking to expand my skill set. I've been taking online courses on deep learning in my spare time because I see it becoming more important in our field."
      ]
    },
    {
      category: "Technical Depth",
      description: "Correctness, depth, and nuance of technical reasoning, relative to the specific Job Role and Level. How well do they know their craft?",
      score: 75,
      rationale: "The candidate demonstrated solid understanding of Python and data science fundamentals, with strong knowledge of Pandas and Scikit-learn. However, their SQL knowledge appeared more basic than expected for a senior level, and some advanced statistical concepts were not fully articulated.",
      evidence: [
        "For data preprocessing, I typically use Pandas for data manipulation, handling missing values with appropriate imputation strategies, and feature engineering using domain knowledge.",
        "When asked about query optimization: I usually use indexes and make sure to avoid SELECT *, but I haven't worked much with complex join optimization or query execution plans.",
        "I've implemented logistic regression, decision trees, and random forests. I understand the bias-variance tradeoff and use cross-validation to prevent overfitting."
      ]
    },
    {
      category: "Response Quality",
      description: "Depth, clarity, and relevance of answers. Did they directly answer the question asked, or did they evade? Were answers structured (e.g., STAR method) or rambling?",
      score: 80,
      rationale: "Most responses were relevant and well-structured, directly addressing the questions asked. The candidate occasionally provided comprehensive STAR-formatted answers for behavioral questions. However, a few technical responses could have been more concise and focused.",
      evidence: [
        "When asked about handling a difficult stakeholder: In my previous role (Situation), I had a product manager who wanted real-time predictions (Task). I scheduled a meeting to understand their needs (Action), and we agreed on a batch processing solution that met their timeline (Result).",
        "For the A/B testing question: I design the experiment, calculate sample size, ensure random assignment, run the test for sufficient duration, and analyze results using hypothesis testing."
      ]
    }
  ],
  qualitative_analysis: {
    key_strengths: [
      "Excellent communication skills with ability to explain technical concepts to non-technical audiences, demonstrated through clear analogies and structured explanations",
      "Strong practical experience with Python data science stack (Pandas, Scikit-learn) with multiple real-world project examples",
      "Growth mindset and genuine enthusiasm for continuous learning, actively taking courses and seeking challenges",
      "Good problem-solving approach with emphasis on understanding business context before technical implementation"
    ],
    areas_for_improvement: [
      "Deepen SQL expertise, particularly in query optimization, complex joins, and database performance tuning for senior-level responsibilities",
      "Develop more concise responses for technical questions; occasionally provided more background than necessary",
      "Expand knowledge of advanced statistical methods and their practical applications in business contexts",
      "Practice more STAR-formatted responses for behavioral questions to ensure consistency in answer structure"
    ]
  }
};

export const mockExceptionalCandidate = {
  evaluation_summary: {
    overall_score: 94,
    overall_summary: "Outstanding candidate who exceeds expectations across all dimensions. Demonstrates masterful technical expertise, exceptional communication abilities, and strong cultural fit. This is a rare find for a senior-level position.",
    recommendation: "Strong Hire",
    recommendation_rationale: "This candidate demonstrates exceptional mastery of all key competencies with deep technical expertise, outstanding communication skills, and proven leadership potential. They would be an immediate asset to the team."
  },
  detailed_scoring: [
    {
      category: "Communication",
      description: "Clarity, articulation, coherence, and professional language. Was the candidate easy to understand and articulate?",
      score: 95,
      rationale: "Exceptional communication throughout. The candidate articulated complex ideas with remarkable clarity, adjusted communication style appropriately for different audiences, and demonstrated active listening.",
      evidence: [
        "Let me break this down into three parts: the data pipeline architecture, the model training workflow, and the deployment strategy. Each has different considerations...",
        "I noticed you mentioned scalability concerns. Let me address that specifically in the context of your current infrastructure..."
      ]
    },
    {
      category: "Professionalism",
      description: "Tone, language, and overall demeanor. Assesses fit for a professional environment.",
      score: 93,
      rationale: "Exemplary professionalism with polished demeanor, thoughtful engagement, and strong preparation evident throughout the discussion.",
      evidence: [
        "I've analyzed your recent quarterly report and I'm particularly impressed by your 40% year-over-year growth in the data platform usage."
      ]
    },
    {
      category: "Positive Attitude",
      description: "Enthusiasm for the role, demonstration of a growth mindset, and constructive response to challenges or feedback.",
      score: 92,
      rationale: "Demonstrated infectious enthusiasm and remarkable growth mindset. Reframed challenges as opportunities and showed genuine excitement about contributing to team success.",
      evidence: [
        "That's a great challenge. In my current role, when we faced similar scaling issues, I led an initiative that not only solved the immediate problem but also created a framework we now use across teams."
      ]
    },
    {
      category: "Technical Depth",
      description: "Correctness, depth, and nuance of technical reasoning, relative to the specific Job Role and Level. How well do they know their craft?",
      score: 96,
      rationale: "Demonstrates masterful technical knowledge far exceeding senior level expectations. Deep understanding of advanced concepts with proven ability to apply them in production environments.",
      evidence: [
        "For feature engineering, I implement both automated approaches using tools like Featuretools and domain-driven engineering. I've found that hybrid approaches typically yield 15-20% improvement in model performance.",
        "Regarding SQL optimization, I regularly use EXPLAIN ANALYZE to understand query execution plans, implement appropriate indexing strategies including partial and covering indexes, and leverage materialized views for complex aggregations.",
        "I've implemented distributed training using Horovod on a Kubernetes cluster, which reduced our model training time from 8 hours to 45 minutes while maintaining model quality."
      ]
    },
    {
      category: "Response Quality",
      description: "Depth, clarity, and relevance of answers. Did they directly answer the question asked, or did they evade? Were answers structured (e.g., STAR method) or rambling?",
      score: 94,
      rationale: "Consistently provided highly relevant, well-structured, and comprehensive responses. Excellent use of STAR method for behavioral questions with concrete metrics and outcomes.",
      evidence: [
        "Situation: My team was struggling with model drift in production. Task: I needed to implement monitoring and retraining pipeline. Action: I designed an automated system using MLflow and Airflow that tracks model performance metrics and triggers retraining when performance degrades beyond threshold. Result: We reduced model deployment time by 60% and increased prediction accuracy by 12%."
      ]
    }
  ],
  qualitative_analysis: {
    key_strengths: [
      "Exceptional technical depth with proven expertise in distributed systems, advanced SQL optimization, and production ML deployment at scale",
      "Outstanding communication abilities with demonstrated skill in translating complex technical concepts for various audiences",
      "Strong leadership potential evidenced by initiative-taking and ability to drive cross-functional projects to successful completion",
      "Impressive track record of delivering measurable business impact through technical solutions (specific metrics provided)",
      "Genuine passion for the field with continuous learning mindset and contributions to open-source community"
    ],
    areas_for_improvement: [
      "Could benefit from developing more experience with specific cloud platforms if not already familiar with the company's infrastructure",
      "May want to further develop management skills if career trajectory includes leading larger teams"
    ]
  }
};

export const mockWeakCandidate = {
  evaluation_summary: {
    overall_score: 52,
    overall_summary: "The candidate shows basic knowledge but falls short of expectations for a senior-level position. Significant gaps in technical depth and response quality raise concerns about readiness for this role.",
    recommendation: "Reject",
    recommendation_rationale: "The candidate's limited technical depth in critical competencies (SQL, advanced statistics) and inability to articulate concrete examples of senior-level work indicate they are not ready for this position. Better suited for a mid-level role."
  },
  detailed_scoring: [
    {
      category: "Communication",
      description: "Clarity, articulation, coherence, and professional language. Was the candidate easy to understand and articulate?",
      score: 65,
      rationale: "Communication was adequate but lacked the clarity and polish expected at senior level. Some explanations were convoluted and the candidate occasionally lost train of thought.",
      evidence: [
        "So, um, machine learning is like... you know, when you have data and you want to... make predictions? I usually just use whatever model works.",
        "I mean, I've done some projects where we used data science stuff, but I can't really remember all the details right now."
      ]
    },
    {
      category: "Professionalism",
      description: "Tone, language, and overall demeanor. Assesses fit for a professional environment.",
      score: 58,
      rationale: "While generally professional, the candidate showed limited preparation and occasionally gave dismissive responses. Did not ask substantive questions about the role or company.",
      evidence: [
        "I didn't really have time to look at your company website, but I'm sure it's interesting.",
        "Yeah, I can probably learn whatever I need to learn on the job."
      ]
    },
    {
      category: "Positive Attitude",
      description: "Enthusiasm for the role, demonstration of a growth mindset, and constructive response to challenges or feedback.",
      score: 48,
      rationale: "Limited enthusiasm evident. The candidate appeared defensive when discussing challenges and did not demonstrate a growth mindset when addressing knowledge gaps.",
      evidence: [
        "I haven't really had problems in my projects. Most things have been pretty straightforward.",
        "I prefer to work with tools I already know rather than learning new ones all the time."
      ]
    },
    {
      category: "Technical Depth",
      description: "Correctness, depth, and nuance of technical reasoning, relative to the specific Job Role and Level. How well do they know their craft?",
      score: 42,
      rationale: "Significant technical gaps for senior level. Basic understanding of common libraries, but unable to discuss advanced concepts, optimization strategies, or demonstrate deep problem-solving abilities. SQL knowledge appears entry-level.",
      evidence: [
        "For SQL, I usually just use SELECT * and basic WHERE clauses. I haven't really needed anything more complex.",
        "When asked about model evaluation: I look at accuracy. If it's above 80%, it's probably good enough.",
        "I've heard of overfitting but I don't really understand what causes it or how to prevent it."
      ]
    },
    {
      category: "Response Quality",
      description: "Depth, clarity, and relevance of answers. Did they directly answer the question asked, or did they evade? Were answers structured (e.g., STAR method) or rambling?",
      score: 50,
      rationale: "Responses frequently lacked depth and specificity. The candidate often provided vague answers without concrete examples and occasionally evaded questions about technical details.",
      evidence: [
        "When asked about a challenging project: It was hard, but I figured it out. I don't remember exactly what I did.",
        "I've worked on various projects with different types of data. They were all pretty similar."
      ]
    }
  ],
  qualitative_analysis: {
    key_strengths: [
      "Basic familiarity with common Python data science libraries (Pandas, Scikit-learn)",
      "Willing to take on new projects"
    ],
    areas_for_improvement: [
      "Develop significantly deeper technical expertise in SQL, statistics, and machine learning algorithms before pursuing senior-level positions",
      "Learn to provide concrete, specific examples with measurable outcomes when discussing past work",
      "Improve communication skills to clearly articulate technical concepts and project experiences",
      "Cultivate a growth mindset and more genuine enthusiasm for continuous learning",
      "Prepare more thoroughly for interviews, including researching the company and role requirements",
      "Practice structured response formats (like STAR method) for behavioral questions"
    ]
  }
};
