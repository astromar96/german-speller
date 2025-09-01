# German Speller - React Version

A modern, beautiful React application for learning German words with Arabic translations and audio pronunciation, built with shadcn/ui components and Tailwind CSS.

## ✨ Features

- **Modern React UI**: Built with React 18, TypeScript, and modern hooks
- **Beautiful Design**: Uses shadcn/ui components with a clean, professional look
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Drag & Drop**: Easy file upload with drag and drop support
- **Audio Testing**: Built-in audio system testing before uploading files
- **Real-time Feedback**: Toast messages and status indicators
- **Dark Mode Ready**: CSS variables prepared for dark mode implementation
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.8+ with Flask backend running (see main README.md)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx      # Button component
│       ├── card.tsx        # Card components
│       ├── input.tsx       # Input component
│       ├── label.tsx       # Label component
│       └── badge.tsx       # Badge component
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
└── index.css              # Global styles and CSS variables
```

## 🎨 UI Components

### shadcn/ui Components Used

- **Button**: Multiple variants (default, outline, secondary, destructive)
- **Card**: Header, content, footer sections with proper spacing
- **Input**: File upload input with proper styling
- **Label**: Accessible form labels
- **Badge**: Status indicators and numbering

### Design System

- **Colors**: CSS custom properties for consistent theming
- **Typography**: Responsive text sizing with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and visual hierarchy
- **Transitions**: Smooth animations for interactive elements

## 🔧 Configuration

### Tailwind CSS

The application uses Tailwind CSS with a custom design system:

- **Custom Colors**: Primary, secondary, accent, and semantic colors
- **Responsive Breakpoints**: Mobile-first responsive design
- **Custom Animations**: Smooth transitions and hover effects

### CSS Variables

All colors and design tokens are defined as CSS custom properties:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  /* ... more variables */
}
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile First**: Designed for mobile devices first
- **Grid Layout**: Responsive grid that adapts to screen size
- **Flexible Cards**: Cards that stack on mobile, grid on desktop
- **Touch Friendly**: Proper touch targets for mobile devices

## 🎵 Audio Features

- **Audio Generation**: Generate audio for German words using gTTS
- **Audio Playback**: Play, stop, and control audio playback
- **Audio Testing**: Built-in audio system testing
- **Error Handling**: Graceful handling of audio errors and browser policies

## 🔄 State Management

Uses React hooks for state management:

- **useState**: Component state (words, messages, audio status)
- **useRef**: File input reference
- **Custom Hooks**: Could be extracted for better organization

## 🚀 Performance Features

- **Lazy Loading**: Components load only when needed
- **Optimized Rendering**: Efficient re-renders with proper state updates
- **Memory Management**: Proper cleanup of audio resources
- **Bundle Optimization**: Tree-shaking and code splitting ready

## 🧪 Testing

The application includes:

- **Audio System Testing**: Test audio generation and playback
- **Error Handling**: Comprehensive error handling and user feedback
- **Status Indicators**: Visual feedback for all operations

## 🔮 Future Enhancements

Potential improvements:

- **Dark Mode**: Toggle between light and dark themes
- **PWA Support**: Progressive Web App capabilities
- **Offline Support**: Service worker for offline functionality
- **Audio Visualization**: Waveform or spectrum visualization
- **Progress Tracking**: Learning progress and statistics
- **Export Features**: Export words and audio to various formats

## 🐛 Troubleshooting

### Common Issues

1. **Audio Not Playing**
   - Check browser autoplay policies
   - Use the audio test feature
   - Ensure backend is running on port 5001

2. **File Upload Issues**
   - Check file format (.xlsx or .xls)
   - Ensure backend is accessible
   - Check browser console for errors

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify all dependencies are installed

## 📚 Dependencies

### Core Dependencies
- React 18.2.0
- TypeScript support
- Tailwind CSS 3.3.5

### UI Components
- shadcn/ui components
- Radix UI primitives
- Lucide React icons

### Development
- React Scripts 5.0.1
- PostCSS and Autoprefixer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the German Speller application. See the main README.md for license information.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the main README.md
3. Check browser console for errors
4. Ensure backend is running properly

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and shadcn/ui**
