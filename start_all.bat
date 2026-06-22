@echo off
title ZenVoiceAI Dashboard Launcher

echo ==========================================
echo Starting all ZenVoiceAI services...
echo [IMPORTANT] Do NOT close this window!
echo Closing this window will terminate ALL services.
echo ==========================================

echo [1/3] Starting NO4 Cbeta...
start /b "" /D "D:\20260606_Cbeta_link_BOT" cmd /c "start.bat"
timeout /t 3 /nobreak >nul

echo [2/3] Starting NO5 MP3+LRC...
start /b "" /D "D:\20260606_MP3_LRC_Creater_reader" cmd /c "RUN.bat"
timeout /t 3 /nobreak >nul

echo [3/3] Starting NO6 MP3 Manager...
start /b "" /D "D:\20260618_MP3_Manager" cmd /c "start.bat"

echo ==========================================
echo Starting Dashboard Server on Port 8080...
echo ==========================================

start /b "" cmd /c "python -m http.server 8080"
timeout /t 3 /nobreak >nul

start http://localhost:8080/

echo.
echo ==========================================
echo Dashboard is opened in your browser!
echo (If not, please go to http://localhost:8080/)
echo.
echo [HOW TO STOP SERVICES]
echo Simply close this black console window (click X),
echo and ALL background services will be terminated.
echo ==========================================
pause
