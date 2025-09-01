#!/bin/bash

echo "🇩🇪 German Speller - تعلم الألمانية"
echo "=================================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.7 or higher and try again"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ Error: pip3 is not installed or not in PATH"
    echo "Please install pip3 and try again"
    exit 1
fi

echo "✅ pip3 found: $(pip3 --version)"

# Install requirements
echo "📦 Installing required packages..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Packages installed successfully!"
else
    echo "❌ Failed to install packages"
    exit 1
fi

# Create sample Excel file
echo "📋 Creating sample Excel file..."
python3 sample_words.py

if [ $? -eq 0 ]; then
    echo "✅ Sample Excel file created"
else
    echo "⚠️  Warning: Could not create sample file"
fi

# Start the application
echo ""
echo "🚀 Starting German Speller application..."
echo "🌐 Open your browser and go to: http://localhost:5000"
echo "⏹️  Press Ctrl+C to stop the application"
echo "--------------------------------------------------"

python3 app.py
