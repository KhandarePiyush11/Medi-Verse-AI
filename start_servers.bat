@echo off
title Medi-Verse AI / Neuro-Synapse Health OS Server Launcher
echo ========================================================
echo Starting Neuro-Synapse Health OS / Medi-Verse AI Servers
echo ========================================================
echo.
cd /d "%~dp0Medi-Verse-AI-main"

echo [1/2] Starting Turborepo Frontends (Ports 3000, 5173, 5174, 5175, 5176)...
start "Neuro-Synapse Frontends (Turbo)" cmd /k "npx turbo run dev"

echo [2/2] Starting Python SaMD AI Inference Engine (Port 8000)...
start "Neuro-Synapse AI Engine (FastAPI)" cmd /k "python -m uvicorn services.ai-engine.app.main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo ========================================================
echo All services launched!
echo - Web Consumer:   http://localhost:3000
echo - Web Hospital:   http://localhost:5173
echo - Manager AI:     http://localhost:5174
echo - Emergency OS:   http://localhost:5175
echo - Web Home:       http://localhost:5176
echo - SaMD AI Engine: http://localhost:8000/docs
echo ========================================================
pause
