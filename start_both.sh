#!/bin/bash

echo "🚀 Starting German Speller - Full Stack Application"
echo ""

# Check if Flask backend is running
if curl -s http://localhost:5001/test-audio > /dev/null 2>&1; then
    echo "✅ Flask Backend: Running on http://localhost:5001"
else
    echo "❌ Flask Backend: Not running"
    echo "   Please start the Flask backend first:"
    echo "   source venv/bin/activate && python app.py"
    echo ""
fi

# Check if React frontend is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React Frontend: Running on http://localhost:3000"
else
    echo "❌ React Frontend: Not running"
    echo "   Please start the React frontend:"
    echo "   npm start"
    echo ""
fi

echo ""
echo "🌐 Application URLs:"
echo "   • React UI (Modern): http://localhost:3000"
echo "   • Flask UI (Original): http://localhost:5001"
echo ""
echo "📁 Sample Excel File: german_words_sample.xlsx"
echo ""
echo "🎯 Quick Test:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Click 'Test Audio System' to verify audio works"
echo "   3. Upload the sample Excel file"
echo "   4. Generate and play audio for German words"
echo ""
