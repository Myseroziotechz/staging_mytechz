@echo off
echo.
echo ========================================
echo   PUSHING TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

git add .
git commit -m "Configure for Hostinger VPS deployment with SQLite"
git push origin main

echo.
echo ========================================
echo   PUSH COMPLETE!
echo ========================================
echo.
echo Now go to your SSH terminal and run the deployment commands.
echo.
pause
