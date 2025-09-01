# Google Cloud Text-to-Speech Setup Guide

## Quick Fix for 401 Authentication Error

The 401 error means your Google Cloud API key is not working properly. **The app has been updated to use the correct authentication method.** Follow these steps to fix it:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Give it a name (e.g., "German Speller TTS")
4. Click "Create"

### Step 2: Enable the Text-to-Speech API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Cloud Text-to-Speech API"
3. Click on it and press "Enable"

### Step 3: Set up Billing (Required)
1. Go to "Billing" in the left menu
2. Click "Link a billing account"
3. Create a new billing account or link an existing one
4. **Note**: Google Cloud TTS has a free tier (4 million characters/month)

### Step 4: Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" and select "Cloud Text-to-Speech API"
5. **Important**: Make sure to restrict the key to only the Text-to-Speech API for security

### Step 5: Test Your API Key
1. Paste the API key in the app
2. Click "Test Audio System"
3. You should see "✅ Google Cloud TTS API connected successfully"

## Common Issues & Solutions

### ❌ "API key is required"
- **Solution**: Enter your API key in the "Google Cloud API Key" field

### ❌ "401 Authentication Error" / "ACCESS_TOKEN_TYPE_UNSUPPORTED"
- **Solution**: The app now uses the correct authentication method (API key in query parameter)
- **Alternative**: Follow steps 1-4 above to create a proper API key

### ❌ "403 Forbidden"
- **Solution**: Make sure you've enabled the Text-to-Speech API and restricted the key to it

### ❌ "Billing not set up"
- **Solution**: Set up billing in your Google Cloud project (required for TTS API)

## Cost Information
- **Free Tier**: 4 million characters per month
- **Paid**: $4.00 per 1 million characters after free tier
- **German words**: ~5-10 characters each, so you can test thousands of words for free

## Alternative: Use VoiceRSS (Free)
If you don't want to set up Google Cloud, you can use VoiceRSS instead:
1. Get a free API key from [VoiceRSS](https://www.voicerss.org/)
2. Check "Use Free VoiceRSS API" in the app
3. Enter your VoiceRSS API key

## Need Help?
- [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech)
- [VoiceRSS Documentation](https://www.voicerss.org/api/)
- Check the browser console for detailed error messages
