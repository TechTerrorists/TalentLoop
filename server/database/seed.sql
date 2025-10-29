-- Dummy Data for AI Avatar Interview System

-- Insert Users (Candidates) - Get IDs from _id column
INSERT INTO "User" (_id, name, email, password, role, "creadtedAt") VALUES
(1, 'John Doe', 'john@example.com', 'hashed_password_123', 'candidate', NOW()),
(2, 'Jane Smith', 'jane@example.com', 'hashed_password_456', 'candidate', NOW()),
(3, 'Mike Johnson', 'mike@example.com', 'hashed_password_789', 'candidate', NOW());

-- Reset User sequence
SELECT setval(pg_get_serial_sequence('"User"', '_id'), 3, true);

-- Insert Companies - Get IDs from _id column
INSERT INTO "Company" (_id, email, password, name, description, industry) VALUES
(1, 'hr@techcorp.com', 'hashed_password_abc', 'TechCorp Inc', 'Leading technology company', 'Technology'),
(2, 'hiring@startupxyz.com', 'hashed_password_def', 'StartupXYZ', 'Innovative startup', 'Software');

-- Reset Company sequence
SELECT setval(pg_get_serial_sequence('"Company"', '_id'), 2, true);

-- Insert Jobs
INSERT INTO "Job" (_id, company_id, title, description, status) VALUES
(1, 1, 'Senior Software Engineer', 'Looking for experienced software engineer with React and Node.js skills', 'active'),
(2, 1, 'Frontend Developer', 'Frontend developer position for building modern web applications', 'active'),
(3, 2, 'Full Stack Developer', 'Full stack developer with Python and JavaScript experience', 'active');

-- Reset Job sequence
SELECT setval(pg_get_serial_sequence('"Job"', '_id'), 3, true);

-- Insert Job Requirements
INSERT INTO "Job_Requirements" (job_id, skill) VALUES
(1, 'JavaScript'),
(1, 'React'),
(1, 'Node.js'),
(1, 'TypeScript'),
(2, 'JavaScript'),
(2, 'React'),
(2, 'CSS'),
(2, 'HTML'),
(3, 'Python'),
(3, 'JavaScript'),
(3, 'FastAPI'),
(3, 'PostgreSQL');

-- Insert Interviews
INSERT INTO interview (id, candidate_id, company_id, job_id, status, "Schedule_Date") VALUES
(1, 1, 1, 1, 'pending', NOW() + INTERVAL '1 day'),
(2, 2, 1, 2, 'completed', NOW() - INTERVAL '2 days'),
(3, 3, 2, 3, 'in_progress', NOW());

-- Reset interview sequence
SELECT setval(pg_get_serial_sequence('interview', 'id'), 3, true);

-- Insert Candidate Info
INSERT INTO "Candidate_Info" (id, company_id, jobid, name, email, resumeurl) VALUES
(1, 1, 1, 'John Doe', 'john@example.com', 'https://example.com/resumes/john.pdf'),
(2, 1, 2, 'Jane Smith', 'jane@example.com', 'https://example.com/resumes/jane.pdf'),
(3, 2, 3, 'Mike Johnson', 'mike@example.com', 'https://example.com/resumes/mike.pdf');

-- Insert Reports
INSERT INTO "Report" (_id, interview_id, overallscore, recommondation, feedback, transcripturl, "createdAt") VALUES
(1, 2, 85, 'Strong candidate with excellent technical skills', 'Good communication and problem-solving abilities', 'https://example.com/transcripts/interview_2.txt', NOW());

-- Reset Report sequence
SELECT setval(pg_get_serial_sequence('"Report"', '_id'), 1, true);

-- Insert Skill Scores
INSERT INTO "skill score" (skill, report_id, score) VALUES
('JavaScript', 1, 90),
('React', 1, 85),
('CSS', 1, 80),
('HTML', 1, 85);
