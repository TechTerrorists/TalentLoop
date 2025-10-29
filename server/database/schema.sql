-- AI Avatar Interview System Database Schema

-- User Table
CREATE TABLE "User" (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    "creadtedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP
);

-- Company Table
CREATE TABLE "Company" (
    _id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ai_context (
  id bigserial PRIMARY KEY,
  source text NOT NULL,
  source_id bigint NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL 
); 
CREATE index on ai_context
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Job Table
CREATE TABLE "Job" (
    _id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES "Company"(_id)
);

-- Job Requirements Table
CREATE TABLE "Job_Requirements" (
    job_id INTEGER NOT NULL,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, skill),
    FOREIGN KEY (job_id) REFERENCES "Job"(_id)
);

-- Interview Table
CREATE TABLE interview (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES "User"(_id),
    FOREIGN KEY (company_id) REFERENCES "Company"(_id),
    FOREIGN KEY (job_id) REFERENCES "Job"(_id)
);

-- Candidate Info Table
CREATE TABLE "Candidate_Info" (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    jobid INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    resumeurl VARCHAR(500),
    FOREIGN KEY (id) REFERENCES "User"(_id),
    FOREIGN KEY (company_id) REFERENCES "Company"(_id),
    FOREIGN KEY (jobid) REFERENCES "Job"(_id)
);

-- Report Table
CREATE TABLE "Report" (
    _id SERIAL PRIMARY KEY,
    interview_id INTEGER NOT NULL,
    overallscore INTEGER NOT NULL,
    recommondation TEXT NOT NULL,
    feedback TEXT,
    transcripturl VARCHAR(500),
    FOREIGN KEY (interview_id) REFERENCES interview(id)
);

-- Skill Score Table
CREATE TABLE "skill score" (
    skill VARCHAR(255) NOT NULL,
    report_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (skill, report_id),
    FOREIGN KEY (report_id) REFERENCES "Report"(_id)
);

-- Indexes for better query performance
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_company_email ON "Company"(email);
CREATE INDEX idx_job_company ON "Job"(company_id);
CREATE INDEX idx_interview_candidate ON interview(candidate_id);
CREATE INDEX idx_interview_company ON interview(company_id);
CREATE INDEX idx_interview_job ON interview(job_id);
CREATE INDEX idx_report_interview ON "Report"(interview_id);
