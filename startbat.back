@echo off
setlocal enabledelayedexpansion

REM PCB Automation Start Script
REM This script starts both backend and frontend servers

echo.
echo ============================================
echo   PCB Automation Application Launcher
echo ============================================
echo.

REM Get the directory of the script
set SCRIPT_DIR=%~dp0

REM Detect local IP address
echo Detecting local network IP...
set "LOCAL_IP="

REM Try to get the first non-localhost IPv4 address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /r "IPv4.*[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*"') do (
    set "IP_TEMP=%%a"
    REM Remove leading spaces
    set "IP_TEMP=!IP_TEMP: =!"
    REM Check if it's not localhost
    if not "!IP_TEMP:~0,3!"=="127" (
        if "!LOCAL_IP!"=="" (
            set "LOCAL_IP=!IP_TEMP!"
        )
    )
)

REM Fallback to localhost if no IP found
if "!LOCAL_IP!"=="" set "LOCAL_IP=localhost"

echo Detected Local IP: !LOCAL_IP!
echo.

REM Ask user for network configuration
set "API_HOST=!LOCAL_IP!"
if not "!LOCAL_IP!"=="localhost" (
    echo Choose network configuration:
    echo 1^) Use localhost ^(local machine only^)
    echo 2^) Use !LOCAL_IP! ^(accessible from network^)
    echo.
    set /p "CHOICE=Enter choice (1 or 2) [default: 2]: "
    
    if "!CHOICE!"=="" set "CHOICE=2"
    if "!CHOICE!"=="1" set "API_HOST=localhost"
)

echo.
echo Configuring environment files...

REM Update backend .env
cd /d "%SCRIPT_DIR%backend"
if not exist ".env" (
    if exist ".env.example" copy ".env.example" ".env" >nul 2>&1
)

if exist ".env" (
    REM Create a temporary file with updated content
    set "TEMP_FILE=%TEMP%\backend_env_temp.txt"
    set "FOUND_FRONTEND_URL=0"
    
    REM Read .env file and update FRONTEND_URL
    for /f "usebackq delims=" %%i in (".env") do (
        set "LINE=%%i"
        echo !LINE! | findstr /b "FRONTEND_URL=" >nul
        if !errorlevel! equ 0 (
            echo FRONTEND_URL=http://!API_HOST!:5173>> "!TEMP_FILE!"
            set "FOUND_FRONTEND_URL=1"
        ) else (
            echo %%i>> "!TEMP_FILE!"
        )
    )
    
    REM If FRONTEND_URL not found, append it
    if "!FOUND_FRONTEND_URL!"=="0" (
        echo FRONTEND_URL=http://!API_HOST!:5173>> "!TEMP_FILE!"
    )
    
    REM Replace original .env with updated content
    move /y "!TEMP_FILE!" ".env" >nul
)

REM Update frontend .env
cd /d "%SCRIPT_DIR%frontend"
if not exist ".env" (
    if exist ".env.example" copy ".env.example" ".env" >nul 2>&1
)

if exist ".env" (
    REM Create a temporary file with updated content
    set "TEMP_FILE=%TEMP%\frontend_env_temp.txt"
    set "FOUND_API_URL=0"
    
    REM Read .env file and update VITE_API_URL
    for /f "usebackq delims=" %%i in (".env") do (
        set "LINE=%%i"
        echo !LINE! | findstr /b "VITE_API_URL=" >nul
        if !errorlevel! equ 0 (
            echo VITE_API_URL=http://!API_HOST!:5000>> "!TEMP_FILE!"
            set "FOUND_API_URL=1"
        ) else (
            echo %%i>> "!TEMP_FILE!"
        )
    )
    
    REM If VITE_API_URL not found, append it
    if "!FOUND_API_URL!"=="0" (
        echo VITE_API_URL=http://!API_HOST!:5000>> "!TEMP_FILE!"
    )
    
    REM Replace original .env with updated content
    move /y "!TEMP_FILE!" ".env" >nul
)

echo Configuration complete!
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] pnpm is not installed. Installing pnpm...
    npm install -g pnpm
)

echo.
echo [1/3] Starting Backend Server...
echo ----------------------------------------

REM Start Backend
cd /d "%SCRIPT_DIR%backend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

start "PCB Backend" cmd /k "node server.js"
echo Backend server started
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Starting Frontend Server...
echo ----------------------------------------

REM Start Frontend
cd /d "%SCRIPT_DIR%frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call pnpm install
)

start "PCB Frontend" cmd /k "pnpm dev"
echo Frontend server starting...
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo   Application is Running!
echo ============================================
echo.
echo   Local Access:
echo     Backend:  http://localhost:5000
echo     Frontend: http://localhost:5173

if not "!API_HOST!"=="localhost" (
    echo.
    echo   Network Access:
    echo     Backend:  http://!API_HOST!:5000
    echo     Frontend: http://!API_HOST!:5173
)

echo.
echo   Close the terminal windows to stop servers
echo ============================================
echo.

REM Open browser
timeout /t 2 /nobreak >nul
start http://!API_HOST!:5173

echo Press any key to exit this launcher...
pause >nul
