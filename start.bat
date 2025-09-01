@echo off
chcp 65001 >nul
echo 🇩🇪 German Speller - تعلم الألمانية
echo ==================================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher and try again
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if pip is available
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: pip is not installed or not in PATH
    echo Please install pip and try again
    pause
    exit /b 1
)

echo ✅ pip found
pip --version

REM Install requirements
echo 📦 Installing required packages...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Failed to install packages
    pause
    exit /b 1
)

echo ✅ Packages installed successfully!

REM Create sample Excel file
echo 📋 Creating sample Excel file...
python sample_words.py

if %errorlevel% neq 0 (
    echo ⚠️  Warning: Could not create sample file
) else (
    echo ✅ Sample Excel file created
)

REM Start the application
echo.
echo 🚀 Starting German Speller application...
echo 🌐 Open your browser and go to: http://localhost:5000
echo ⏹️  Press Ctrl+C to stop the application
echo --------------------------------------------------

python app.py

pause
