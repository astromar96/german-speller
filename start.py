#!/usr/bin/env python3
"""
German Speller Startup Script
This script checks dependencies and starts the application.
"""

import sys
import subprocess
import os

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 7):
        print("❌ Error: Python 3.7 or higher is required.")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_requirements():
    """Install required packages if not already installed."""
    try:
        import flask
        import pandas
        import openpyxl
        import gtts
        print("✅ All required packages are already installed.")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("📦 Installing required packages...")
        
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Packages installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install packages. Please run manually:")
            print("   pip install -r requirements.txt")
            return False

def create_sample_excel():
    """Create a sample Excel file if it doesn't exist."""
    if not os.path.exists("sample_german_words.xlsx"):
        print("📋 Creating sample Excel file...")
        try:
            import sample_words
            print("✅ Sample Excel file created: sample_german_words.xlsx")
        except Exception as e:
            print(f"⚠️  Warning: Could not create sample file: {e}")
    else:
        print("✅ Sample Excel file already exists")

def start_application():
    """Start the Flask application."""
    print("\n🚀 Starting German Speller application...")
    print("🌐 Open your browser and go to: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the application")
    print("-" * 50)
    
    try:
        import app
        # The app will start automatically due to the if __name__ == '__main__' block
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except Exception as e:
        print(f"❌ Error starting application: {e}")

def main():
    """Main startup function."""
    print("🇩🇪 German Speller - تعلم الألمانية")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Create sample Excel file
    create_sample_excel()
    
    # Start application
    start_application()

if __name__ == "__main__":
    main()
