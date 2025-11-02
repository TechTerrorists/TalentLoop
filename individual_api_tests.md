# Individual API Test Commands

## Quick Individual Tests

### Root & Health
```bash
curl http://localhost:8000/
curl http://localhost:8000/api/v1/health
```

### Company APIs
```bash
# Create company
curl -X POST http://localhost:8000/company/createcompany \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Company", "email": "test@company.com", "password": "password123"}'

# Get company
curl http://localhost:8000/company/1

# Update company
curl -X PATCH http://localhost:8000/company/updatecompany/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Company"}'

# Delete company
curl -X DELETE http://localhost:8000/company/deletecompany/1
```

### Job APIs
```bash
# Create job
curl -X POST http://localhost:8000/jobs/add-job \
  -H "Content-Type: application/json" \
  -d '{"title": "Software Engineer", "company_id": 1, "description": "Test job", "status": "pending"}'

# Get all jobs for company
curl http://localhost:8000/jobs/1

# Get specific job
curl http://localhost:8000/jobs/job/1

# Update job
curl -X PATCH http://localhost:8000/jobs/update-job/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Engineer", "company_id": 1, "description": "Updated"}'

# Update job status
curl -X PATCH "http://localhost:8000/jobs/update-status/1?status=filled"

# Delete job
curl -X DELETE http://localhost:8000/jobs/delete-job/1
```

### Job Skills APIs
```bash
# Add job skills
curl -X POST http://localhost:8000/jobsskills/add-jobskills/1 \
  -H "Content-Type: application/json" \
  -d '["Python", "JavaScript", "React"]'

# Get job skills
curl http://localhost:8000/jobsskills/1

# Get all company job skills
curl "http://localhost:8000/jobsskills/?companyid=1"

# Delete specific skill
curl -X DELETE "http://localhost:8000/jobsskills/delete-jobskill/1?skill=React"

# Delete all job skills
curl -X DELETE http://localhost:8000/jobsskills/delete-jobskills/1
```

### Candidate APIs
```bash
# Upload resume (requires PDF file)
curl -X POST http://localhost:8000/candidate/uploadresume/1 \
  -F "file=@resume.pdf"
```

### Mail APIs
```bash
# Send invitation
curl -X POST http://localhost:8000/mail/inviteCandidates \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "company_id": 1, "job_id": 1, "schedule_date": "2024-01-15", "schedule_time": "10:00"}'

# Login
curl -X POST http://localhost:8000/mail/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john@example.com&password=temppass123"

# Reset password (requires auth token)
curl -X POST http://localhost:8000/mail/reset-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"newpassword123"'
```

### Report APIs
```bash
# Add skill scores
curl -X POST http://localhost:8000/report/addskillscores \
  -H "Content-Type: application/json" \
  -d '[{"interview_id": 1, "skill": "Python", "score": 85}]'

# Get skill scores
curl http://localhost:8000/report/skillscores/1

# Create report
curl -X POST http://localhost:8000/report/CreateReport \
  -H "Content-Type: application/json" \
  -d '{"interview_id": 1, "feedback": "Good", "recommendation": "Hire"}'

# Get report
curl http://localhost:8000/report/1

# Get multiple reports
curl -X POST http://localhost:8000/report/ \
  -H "Content-Type: application/json" \
  -d '[1, 2, 3]'
```

### Interview APIs
```bash
# Create interview
curl -X POST http://localhost:8000/api/v1/interviews/ \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": 1, "job_id": 1, "company_id": 1}'

# List interviews
curl http://localhost:8000/api/v1/interviews/

# Get interview
curl http://localhost:8000/api/v1/interviews/1

# Start interview
curl -X POST http://localhost:8000/api/v1/interviews/1/start

# End interview
curl -X POST http://localhost:8000/api/v1/interviews/1/end

# Get interview report
curl http://localhost:8000/api/v1/interviews/1/report
```

## PowerShell Commands (Windows)
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method Get

# Create company
$body = @{
    name = "Test Company"
    email = "test@company.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/company/createcompany" -Method Post -Body $body -ContentType "application/json"
```

## Python Requests
```python
import requests

# Health check
response = requests.get("http://localhost:8000/api/v1/health")
print(response.json())

# Create company
data = {
    "name": "Test Company",
    "email": "test@company.com", 
    "password": "password123"
}
response = requests.post("http://localhost:8000/company/createcompany", json=data)
print(response.json())
```