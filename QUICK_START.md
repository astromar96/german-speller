# 🚀 Quick Start Guide

## For macOS/Linux Users:

1. **Open Terminal** and navigate to the project folder
2. **Run the startup script**:
   ```bash
   ./start.sh
   ```
   This will automatically:
   - Check Python installation
   - Install required packages
   - Create a sample Excel file
   - Start the application

## For Windows Users:

1. **Open Command Prompt** and navigate to the project folder
2. **Run the startup script**:
   ```cmd
   start.bat
   ```

## Manual Setup (Alternative):

1. **Install Python dependencies**:
   ```bash
   pip3 install -r requirements.txt
   # or on Windows:
   pip install -r requirements.txt
   ```

2. **Create sample Excel file**:
   ```bash
   python3 sample_words.py
   # or on Windows:
   python sample_words.py
   ```

3. **Start the application**:
   ```bash
   python3 app.py
   # or on Windows:
   python app.py
   ```

## 🌐 Access the Application:

1. Open your web browser
2. Go to: `http://localhost:5000`
3. Upload the `sample_german_words.xlsx` file (or your own Excel file)
4. Start learning German with audio pronunciation!

## 📋 Excel File Format:

Your Excel file needs 2 columns:
- **Column A**: German words
- **Column B**: Arabic translations

You can use the provided `sample_words.csv` file:
1. Open it in Excel
2. Save as `.xlsx` format
3. Upload to the application

## 🆘 Need Help?

- Check the main `README.md` for detailed instructions
- Ensure you have Python 3.7+ installed
- Make sure your Excel file has exactly 2 columns
- Check that you have an internet connection (for audio generation)

---

**Happy Learning! 🎓**
