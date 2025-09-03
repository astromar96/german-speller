# 🤖 ChatGPT API Setup for Image Recognition

## Overview
The German Speller app now includes an **Image Recognition** feature that uses ChatGPT's Vision API to extract German words and Arabic translations from glossary images.

## 🚀 Features
- **AI-Powered Extraction**: Automatically identifies German words in images
- **Smart Translation**: Provides accurate Arabic translations
- **Multiple Formats**: Supports JPEG, PNG, and WebP images
- **Seamless Integration**: Extracted words work with the existing audio system

## 🔑 Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy your API key (starts with `sk-`)

### 2. Update the Code
1. Open `src/App.tsx`
2. Find this line:
   ```typescript
   const OPENAI_API_KEY = 'your-openai-api-key-here';
   ```
3. Replace `'your-openai-api-key-here'` with your actual API key:
   ```typescript
   const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
   ```

### 3. Save and Restart
1. Save the file
2. Restart your development server (`npm start`)
3. The Image Recognition tab will now work with your API key

## 💰 Cost Information
- **GPT-4 Vision API**: ~$0.01-0.03 per image (depending on image size)
- **Free Tier**: $5 credit for new users
- **Pricing**: [OpenAI Pricing Page](https://openai.com/pricing)

## 📸 How to Use

### Step 1: Switch to Image Tab
- Click the **🖼️ Image Recognition** tab

### Step 2: Upload Image
- Drag & drop or click to upload a glossary image
- Supported formats: JPEG, PNG, WebP
- Best results with clear, well-lit images

### Step 3: AI Processing
- ChatGPT analyzes the image
- Extracts German words and Arabic translations
- Returns structured data in JSON format

### Step 4: Use Extracted Words
- Words appear in the main word list
- Click the 🔊 button to hear pronunciation
- Adjust audio speed as needed

## 🎯 Best Practices

### Image Quality
- **High contrast** between text and background
- **Good lighting** - avoid shadows and glare
- **Clear text** - avoid blurry or pixelated images
- **Proper orientation** - text should be readable

### Content Structure
- **German words** should be clearly visible
- **Arabic translations** should be present
- **Organized layout** helps with extraction accuracy
- **Avoid complex backgrounds** or overlapping text

## 🔧 Troubleshooting

### Common Issues

#### "API Error: 401"
- Check if your API key is correct
- Ensure you have sufficient credits
- Verify your OpenAI account is active

#### "No German words found"
- Image quality might be too low
- Text might not be clearly visible
- Try a different image with better contrast

#### "Failed to parse response"
- Network connectivity issues
- API rate limiting
- Try again in a few moments

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL to see detailed logs.

## 🚨 Security Notes

### API Key Security
- **Never commit** your API key to version control
- **Use environment variables** in production
- **Monitor usage** to avoid unexpected charges
- **Rotate keys** regularly

### Production Deployment
For production use, consider:
- Using environment variables
- Implementing rate limiting
- Adding user authentication
- Monitoring API usage

## 📚 Example Images

### Good Examples
- Textbook glossaries
- Vocabulary lists
- Flashcards
- Study materials

### Avoid
- Handwritten text (unless very clear)
- Low-resolution images
- Complex layouts
- Text with heavy decorations

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have sufficient OpenAI credits
4. Try with a different image
5. Check your internet connection

## 🔄 Updates

This feature is actively maintained. Check for updates to:
- Improve extraction accuracy
- Add support for more languages
- Optimize API usage
- Enhance user experience

---

**Happy Learning! 🇩🇪📚✨**
