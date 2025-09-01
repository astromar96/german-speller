# 🇩🇪 German Speller - تعلم الألمانية

A modern web application for learning German words with Arabic translations and audio pronunciation. Upload Excel files containing German words and Arabic translations, then generate and play audio pronunciations for proper German spelling.

## ✨ Features

- **📁 Excel File Upload**: Support for .xlsx and .xls files
- **🇩🇪 German Words**: Display German words clearly
- **🇸🇦 Arabic Translations**: Show Arabic translations with proper RTL support
- **🔊 Audio Generation**: Generate German pronunciation using Google Text-to-Speech
- **🎵 Audio Playback**: Play, stop, and control audio for each word
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful gradient design with smooth animations
- **🔄 Drag & Drop**: Easy file upload with drag and drop support

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:5000
   ```

## 📋 Excel File Format

Your Excel file should have exactly 2 columns:

| Column A (German) | Column B (Arabic) |
|-------------------|-------------------|
| Hallo             | مرحبا             |
| Danke             | شكرا              |
| Bitte             | من فضلك           |

### Creating a Sample File

Run the included sample generator:
```bash
python sample_words.py
```

This will create `sample_german_words.xlsx` with 20 common German phrases.

## 🎯 How to Use

1. **Upload Excel File**:
   - Click the upload area or drag & drop your Excel file
   - The file should have German words in column A and Arabic translations in column B

2. **View Words**:
   - After successful upload, your words will appear in cards
   - Each card shows the German word and Arabic translation

3. **Generate Audio**:
   - Click "Generate Audio" for any word
   - The system will create German pronunciation using TTS
   - This may take a few seconds for each word

4. **Play Audio**:
   - Once generated, click "Play" to hear the pronunciation
   - Click "Stop" to stop playback
   - Only one audio can play at a time

5. **Manage Data**:
   - Use "Clear All" to remove all words and start over
   - Upload new files anytime

## 🛠️ Technical Details

### Backend (Python/Flask)
- **Flask**: Web framework for the API
- **Pandas**: Excel file processing
- **gTTS**: Google Text-to-Speech for German pronunciation
- **OpenPyXL**: Excel file reading support

### Frontend (HTML/CSS/JavaScript)
- **Responsive Design**: CSS Grid and Flexbox
- **Modern UI**: Gradient backgrounds and smooth animations
- **Font Awesome**: Icons for better user experience
- **Drag & Drop**: HTML5 file upload API

### File Structure
```
german-speller/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── sample_words.py       # Sample Excel generator
├── templates/
│   └── index.html        # Main web interface
├── uploads/              # Uploaded files (auto-created)
├── audio_cache/          # Generated audio files (auto-created)
└── README.md             # This file
```

## 🔧 Configuration

### Port Configuration
The default port is 5000. To change it, modify the last line in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=YOUR_PORT)
```

### File Size Limits
Maximum file size is set to 16MB. To change this, modify in `app.py`:
```python
app.config['MAX_CONTENT_LENGTH'] = YOUR_SIZE_IN_BYTES
```

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Mobile Support

The application is fully responsive and works on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktop computers
- 💻 Laptops

## 🚨 Troubleshooting

### Common Issues

1. **"No file uploaded" error**:
   - Make sure you've selected a file before clicking upload
   - Check that the file is not corrupted

2. **"Excel file must have at least 2 columns" error**:
   - Ensure your Excel file has at least 2 columns
   - First column should contain German words
   - Second column should contain Arabic translations

3. **Audio not generating**:
   - Check your internet connection (gTTS requires internet)
   - Wait a few seconds for processing
   - Try refreshing the page

4. **Port already in use**:
   - Change the port in `app.py`
   - Or stop other applications using port 5000

### Audio Generation Issues

- **Internet Required**: gTTS needs internet connection
- **Processing Time**: Audio generation may take 5-10 seconds per word
- **File Size**: Generated audio files are stored locally

## 🔒 Security Notes

- Files are processed in memory and not permanently stored
- Audio files are cached locally and can be cleared
- No user data is permanently stored on the server

## 🚀 Future Enhancements

Potential improvements for future versions:
- [ ] User accounts and word lists
- [ ] Multiple language support
- [ ] Offline audio generation
- [ ] Export functionality
- [ ] Progress tracking
- [ ] Spaced repetition learning
- [ ] Quiz mode

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Ensure all dependencies are properly installed
4. Verify your Excel file format matches the requirements

---

**Happy Learning! 🎓 Viel Erfolg beim Lernen! بالتوفيق في التعلم!**
