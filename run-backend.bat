@echo off
echo ====================================================
echo Starting Hostel Management System - Backend Server
echo ====================================================
cd /d "%~dp0backend"
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
call mvnw.cmd spring-boot:run
pause
