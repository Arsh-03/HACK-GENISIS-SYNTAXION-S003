@echo off
title Nexis CBT Platform - Start All Services

echo.
echo ==========================================
echo   Nexis CBT Platform - Starting All
echo ==========================================
echo.

echo [1/4] Starting AI Microservice (Port 8000)...
start "AI Microservice" cmd /k "cd /d "%~dp0Code\AI" && start-ai.bat"

timeout /t 3 /nobreak >nul

echo [2/4] Starting Backend API (Port 5001)...
start "Backend API" cmd /k "cd /d "%~dp0Code\backend" && start-backend.bat"

timeout /t 3 /nobreak >nul

echo [3/4] Starting Exam Dashboard (Port 5173)...
start "Exam Dashboard" cmd /k "cd /d "%~dp0Code\ExamDashboard" && start-dashboard.bat"

echo [4/4] Starting Admin Dashboard (Port 3000)...
start "Admin Dashboard" cmd /k "cd /d "%~dp0Code\AdminDashboard" && start-admin.bat"

timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo   All services started!
echo ==========================================
echo.
echo   AI Microservice:  http://localhost:8000
echo   Backend API:      http://localhost:5001
echo   Exam Dashboard:   http://localhost:5173
echo   Admin Dashboard:  http://localhost:3000
echo.
echo   Close this window after all services are running.
echo.
pause
