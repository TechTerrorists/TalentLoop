@echo off
echo Starting AI Avatar Interview System...

echo.
echo Starting RAG Service (WSL)...
start "RAG" cmd /k "cd pipecat-quickstart/rag && python main.py"

timeout /t 3 /nobreak > nul

echo.
echo Starting Pipecat Bot (WSL)...
start "Pipecat" wsl -e bash -lic "cd '/mnt/e/Coding Playground/QuantumHex/AI Avatar Interview Website/pipecat-quickstart' && uv sync && uv run bot.py"

timeout /t 5 /nobreak > nul

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd server && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd public && npm run dev"

echo.
echo All servers are starting...
echo RAG Service: http://localhost:8001
echo Pipecat Bot: http://localhost:7860
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause