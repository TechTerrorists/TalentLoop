@echo off
echo Starting AI Avatar Interview System...

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd server && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd public && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause