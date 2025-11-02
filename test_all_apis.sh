#!/bin/bash

echo "Testing TalentLoop APIs..."
echo

# Root and Health Check
echo "=== ROOT & HEALTH ==="
curl -X GET http://localhost:8000/
echo
curl -X GET http://localhost:8000/api/v1/health
echo

# Company APIs
echo "=== COMPANY APIs ==="
echo "Creating company..."
curl -X POST http://localhost:8000/company/createcompany \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Company", "email": "test@company.com", "password": "password123"}'
echo

echo "Getting company (ID: 1)..."
curl -X GET http://localhost:8000/company/1
echo

echo "Updating company (ID: 1)..."
curl -X PATCH http://localhost:8000/company/updatecompany/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Company"}'
echo

# Job APIs
echo "=== JOB APIs ==="
echo "Creating job..."
curl -X POST http://localhost:8000/jobs/add-job \
  -H "Content-Type: application/json" \
  -d '{"title": "Software Engineer", "company_id": 1, "description": "Test job", "status": "pending"}'
echo

echo "Getting all jobs for company (ID: 1)..."
curl -X GET http://localhost:8000/jobs/1
echo

echo "Getting specific job (ID: 1)..."
curl -X GET http://localhost:8000/jobs/job/1
echo

echo "Updating job status..."
curl -X PATCH "http://localhost:8000/jobs/update-status/1?status=pending"
echo

echo "Updating job details..."
curl -X PATCH http://localhost:8000/jobs/update-job/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Software Engineer", "company_id": 1, "description": "Updated job"}'
echo

# Job Skills APIs
echo "=== JOB SKILLS APIs ==="
echo "Adding job skills..."
curl -X POST http://localhost:8000/jobsskills/add-jobskills/1 \
  -H "Content-Type: application/json" \
  -d '["Python", "JavaScript", "React"]'
echo

echo "Getting job skills..."
curl -X GET http://localhost:8000/jobsskills/1
echo

echo "Getting all company job skills..."
curl -X GET "http://localhost:8000/jobsskills/?companyid=1"
echo

echo "Deleting specific skill..."
curl -X DELETE "http://localhost:8000/jobsskills/delete-jobskill/1?skill=React"
echo

# Candidate APIs (File upload test - requires actual PDF file)
echo "=== CANDIDATE APIs ==="
echo "Note: Resume upload requires actual PDF file"
# curl -X POST http://localhost:8000/candidate/uploadresume/1 \
#   -F "file=@sample_resume.pdf"

# Mail APIs
echo "=== MAIL APIs ==="
echo "Sending invitation..."
curl -X POST http://localhost:8000/mail/inviteCandidates \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "company_id": 1, "job_id": 1, "schedule_date": "2024-01-15", "schedule_time": "10:00"}'
echo

echo "Login attempt..."
curl -X POST http://localhost:8000/mail/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john@example.com&password=temppass123"
echo

# Report APIs
echo "=== REPORT APIs ==="
echo "Adding skill scores..."
curl -X POST http://localhost:8000/report/addskillscores \
  -H "Content-Type: application/json" \
  -d '[{"interview_id": 1, "skill": "Python", "score": 85}, {"interview_id": 1, "skill": "JavaScript", "score": 90}]'
echo

echo "Getting skill scores..."
curl -X GET http://localhost:8000/report/skillscores/1
echo

echo "Creating report..."
curl -X POST http://localhost:8000/report/CreateReport \
  -H "Content-Type: application/json" \
  -d '{"interview_id": 1, "feedback": "Good performance", "recommendation": "Hire"}'
echo

echo "Getting report..."
curl -X GET http://localhost:8000/report/1
echo

echo "Getting multiple reports..."
curl -X POST http://localhost:8000/report/ \
  -H "Content-Type: application/json" \
  -d '[1]'
echo

# Interview APIs
echo "=== INTERVIEW APIs ==="
echo "Creating interview..."
curl -X POST http://localhost:8000/api/v1/interviews/ \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": 1, "job_id": 1, "company_id": 1}'
echo

echo "Getting interviews list..."
curl -X GET http://localhost:8000/api/v1/interviews/
echo

echo "Getting interview details..."
curl -X GET http://localhost:8000/api/v1/interviews/1
echo

echo "Starting interview..."
curl -X POST http://localhost:8000/api/v1/interviews/1/start
echo

echo "Getting interview report..."
curl -X GET http://localhost:8000/api/v1/interviews/1/report
echo

echo "Ending interview..."
curl -X POST http://localhost:8000/api/v1/interviews/1/end
echo

# Cleanup
echo "=== CLEANUP ==="
echo "Deleting job skills..."
curl -X DELETE http://localhost:8000/jobsskills/delete-jobskills/1
echo

echo "Deleting job..."
curl -X DELETE http://localhost:8000/jobs/delete-job/1
echo

echo "Deleting company..."
curl -X DELETE http://localhost:8000/company/deletecompany/1
echo

echo
echo "=== ALL TESTS COMPLETED ==="