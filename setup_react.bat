@echo off
echo 🚀 Setting up German Speller React Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node -v') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16+ is required. Current version: 
    node -v
    echo    Please update Node.js to version 16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node -v

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected
npm -v

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo 🎉 React application setup complete!
echo.
echo 📋 Next steps:
echo    1. Make sure your Flask backend is running on port 5001
echo    2. Start the React development server:
echo       npm start
echo    3. Open your browser to: http://localhost:3000
echo.
echo 🔧 Available commands:
echo    npm start     - Start development server
echo    npm build     - Build for production
echo    npm test      - Run tests
echo    npm run eject - Eject from Create React App (not recommended)
echo.
echo 📚 For more information, see README_REACT.md
echo.
pause
