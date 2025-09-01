# 🚀 Quick Start - React Version

Get the German Speller React application running in minutes!

## ⚡ Prerequisites

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Flask Backend** - Must be running on port 5001

## 🎯 Quick Setup

### 1. Setup React App (Choose your OS)

**macOS/Linux:**
```bash
./setup_react.sh
```

**Windows:**
```cmd
setup_react.bat
```

**Manual Setup:**
```bash
npm install
```

### 2. Start React Development Server

```bash
npm start
```

### 3. Open Browser

Navigate to: **http://localhost:3000**

## 🔧 Backend Setup

Make sure your Flask backend is running:

```bash
# In another terminal
source venv/bin/activate  # macOS/Linux
python app.py
```

The backend should be accessible at: **http://localhost:5001**

## 📁 File Structure

```
german-speller/
├── src/                    # React source code
│   ├── components/ui/      # shadcn/ui components
│   ├── App.tsx            # Main application
│   └── index.css          # Global styles
├── public/                 # Static files
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Features

- ✨ **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- 🎵 **Audio Testing** - Test audio system before use
- 📤 **Drag & Drop** - Easy file upload
- 🔄 **Real-time Updates** - Live status and feedback

## 🧪 Test the Application

1. **Upload Sample File**: Use `german_words_sample.xlsx`
2. **Test Audio**: Click "Test Audio System" button
3. **Generate Audio**: Click "Generate Audio" for words
4. **Play Audio**: Click "Play" button to hear pronunciation

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
npm install
```

**Backend connection issues:**
- Ensure Flask is running on port 5001
- Check browser console for errors

**Audio not working:**
- Use the "Test Audio System" button
- Check browser autoplay policies

**Styling issues:**
- Verify Tailwind CSS is configured
- Check for CSS conflicts

## 📚 Next Steps

- Read `README_REACT.md` for detailed documentation
- Customize the UI components in `src/components/ui/`
- Modify the main app logic in `src/App.tsx`
- Add new features and components

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Verify backend is running properly

---

**🎉 You're all set! Enjoy your modern German Speller React application!**
