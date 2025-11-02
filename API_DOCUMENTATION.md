# TalentLoop API Documentation

## Base URL
`http://localhost:8000`

## API Endpoints

### 🏢 Company APIs (`/company`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/company/createcompany` | Create a new company | CompanyResponse |
| PATCH | `/company/updatecompany/{compid}` | Update company details | CompanyResponse |
| DELETE | `/company/deletecompany/{compid}` | Delete a company | CompanyResponse |
| GET | `/company/{compid}` | Get company by ID | CompanyResponse |

### 💼 Job APIs (`/jobs`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/jobs/add-job` | Create a new job | JobResponse |
| DELETE | `/jobs/delete-job/{jobid}` | Delete a job | JobResponse |
| PATCH | `/jobs/update-job/{jobid}` | Update job details | JobResponse |
| PATCH | `/jobs/update-status/{jobid}` | Update job status | JobResponse |
| GET | `/jobs/{company_id}` | Get all jobs for a company | List[JobResponse] |
| GET | `/jobs/job/{jobid}` | Get specific job by ID | JobResponse |

### 🎯 Job Skills APIs (`/jobsskills`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/jobsskills/add-jobskills/{jobid}` | Add skills to a job | List[JobSkill] |
| DELETE | `/jobsskills/delete-jobskills/{jobid}` | Delete all skills for a job | List[JobSkill] |
| DELETE | `/jobsskills/delete-jobskill/{jobid}` | Delete specific skill from job | JobSkill |
| GET | `/jobsskills/{jobid}` | Get all skills for a job | List[JobSkill] |
| GET | `/jobsskills/` | Get all job skills for company | List[JobSkill] |

### 👤 Candidate APIs (`/candidate`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/candidate/uploadresume/{candidateid}` | Upload and parse PDF resume | String (resume text) |

### 📧 Mail APIs (`/mail`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/mail/inviteCandidates` | Send interview invitation | Success message |
| POST | `/mail/login` | User authentication | Access token |
| POST | `/mail/reset-password` | Reset user password | Success message |

### 📊 Report APIs (`/report`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/report/addskillscores` | Add skill scores | List of skill scores |
| GET | `/report/skillscores/{interviewid}` | Get skill scores for interview | List of skill scores |
| POST | `/report/CreateReport` | Create interview report | ReportResponse |
| POST | `/report/` | Get reports for multiple interviews | List[ReportResponse] |
| GET | `/report/{reportid}` | Get specific report | ReportResponse |

### 🎤 Interview APIs (`/api/v1`)

| Method | Endpoint | Description | Response Model |
|--------|----------|-------------|----------------|
| POST | `/api/v1/interviews/` | Create interview session | InterviewResponse |
| GET | `/api/v1/interviews/{session_id}` | Get interview details | InterviewResponse |
| POST | `/api/v1/interviews/{session_id}/start` | Start interview | Success message + bot_url |
| POST | `/api/v1/interviews/{session_id}/end` | End interview | Success message |
| GET | `/api/v1/interviews/{session_id}/report` | Get interview report | ReportCreate |
| GET | `/api/v1/interviews/` | List all interviews | List of interviews |
| GET | `/api/v1/health` | Health check | Status message |

### 🏠 Root API

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/` | Root endpoint | Welcome message |

## Quick Test Commands

You can test your APIs using curl or any API client:

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Get root message
curl http://localhost:8000/

# Create company (example)
curl -X POST http://localhost:8000/company/createcompany \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Company", "email": "test@company.com"}'
```

## Notes

- All endpoints return JSON responses
- Error responses follow HTTP status codes (400, 404, 500, etc.)
- Authentication required for mail endpoints (login, reset-password)
- File uploads supported for resume upload (PDF only)
- CORS enabled for localhost:3000 and 127.0.0.1:3000