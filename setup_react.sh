#!/bin/bash

echo "🚀 Setting up German Speller React Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    echo "   Please update Node.js to version 16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 React application setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure your Flask backend is running on port 5001"
echo "   2. Start the React development server:"
echo "      npm start"
echo "   3. Open your browser to: http://localhost:3000"
echo ""
echo "🔧 Available commands:"
echo "   npm start     - Start development server"
echo "   npm build     - Build for production"
echo "   npm test      - Run tests"
echo "   npm run eject - Eject from Create React App (not recommended)"
echo ""
echo "📚 For more information, see README_REACT.md"
echo ""
