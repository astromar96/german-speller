# German Speller - Frontend Only Version

A completely frontend-only React application for learning German words with Arabic translations and audio pronunciation using the Web Speech API.

## 🌟 Features

- **No Backend Required**: Runs entirely in the browser
- **Web Speech API**: Uses browser's built-in text-to-speech for German pronunciation
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Excel File Support**: Upload Excel files with German-Arabic word pairs
- **Real-time Audio**: Instant pronunciation without server requests
- **Cross-platform**: Works on any device with a modern browser

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd german-speller
   ```

2. **Switch to the frontend-only branch**:
   ```bash
   git checkout frontend-only
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── index.css            # Global styles and Tailwind imports
├── lib/
│   └── utils.ts         # Utility functions
└── react-app-env.d.ts   # TypeScript declarations
```

## 🎯 How It Works

### Web Speech API Integration

The application uses the browser's built-in `SpeechSynthesis` API:

```typescript
const utterance = new SpeechSynthesisUtterance(word);
utterance.lang = 'de-DE'; // German language
utterance.rate = 0.8;     // Slightly slower for better pronunciation
speechSynthesis.speak(utterance);
```

### Voice Selection

The app automatically detects and uses German voices when available:

```typescript
const germanVoice = voices.find(voice => 
  voice.lang.startsWith('de') || 
  voice.name.toLowerCase().includes('german') ||
  voice.name.toLowerCase().includes('deutsch')
);
```

### File Upload

Currently, the app loads sample data when a file is uploaded. For full Excel parsing, you would need to add a library like SheetJS:

```bash
npm install xlsx
```

## 🛠️ Customization

### Adding Excel Parsing

To enable actual Excel file parsing, install SheetJS and modify the `uploadFile` function:

```typescript
import * as XLSX from 'xlsx';

const uploadFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  // Process the data and set wordsData
};
```

### Voice Configuration

You can customize speech settings in the `speakWord` function:

```typescript
utterance.rate = 0.8;    // Speed (0.1 to 10)
utterance.pitch = 1.0;   // Pitch (0 to 2)
utterance.volume = 1.0;  // Volume (0 to 1)
```

## 🌐 Browser Compatibility

The Web Speech API is supported in:
- ✅ Chrome/Chromium (version 33+)
- ✅ Safari (version 7+)
- ✅ Firefox (version 49+)
- ✅ Edge (version 14+)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Styling

Built with Tailwind CSS for:
- Consistent design system
- Responsive utilities
- Dark mode support (ready for implementation)
- Custom animations

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### TypeScript

The project uses TypeScript for:
- Type safety
- Better IDE support
- Easier refactoring
- Documentation through types

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Netlify**: Drag and drop the `build` folder
2. **Vercel**: Connect your GitHub repository
3. **GitHub Pages**: Use `gh-pages` package
4. **Any static hosting**: Upload the `build` folder

## 🔒 Privacy & Security

- **No Server Required**: All processing happens in the browser
- **No Data Storage**: No personal data is stored or transmitted
- **Offline Capable**: Works without internet connection (after initial load)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Audio Not Working

1. **Check browser support**: Ensure you're using a supported browser
2. **Check permissions**: Some browsers require user interaction before playing audio
3. **Check voice availability**: The app will use default voice if no German voice is found
4. **Test with the "Test Audio System" button**: This will show detailed diagnostics

### File Upload Issues

1. **File format**: Ensure the file is `.xlsx` or `.xls` format
2. **File size**: Large files may take time to process
3. **Browser compatibility**: Some older browsers may have issues with FileReader API

### Performance Issues

1. **Large files**: Consider splitting large Excel files
2. **Voice loading**: Voices may take time to load on first use
3. **Memory usage**: Close other tabs to free up memory

## 🔮 Future Enhancements

- [ ] Full Excel parsing with SheetJS
- [ ] Voice selection dropdown
- [ ] Speech rate controls
- [ ] Offline mode with Service Workers
- [ ] Dark mode toggle
- [ ] Export functionality
- [ ] Progress tracking
- [ ] Multiple language support

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Enjoy learning German with this frontend-only application! 🇩🇪🇸🇦**
