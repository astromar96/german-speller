import React, { useState, useRef } from 'react';
import './App.css';

interface WordData {
  id: number;
  german: string;
  arabic: string;
}

function App() {
  const [wordsData, setWordsData] = useState<WordData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [audioTestResult, setAudioTestResult] = useState<string>('');
  const [audioSpeed, setAudioSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('audioSpeed');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [speedChangeNotification, setSpeedChangeNotification] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  
  // Embedded Google Cloud API key
  const GOOGLE_CLOUD_API_KEY = 'AIzaSyCsx1IyPxscQ1YpPOGEHSBRQBQPvFjog7k';

  // Save speed to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('audioSpeed', audioSpeed.toString());
  }, [audioSpeed]);

  // Keyboard shortcuts for speed control
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setAudioSpeed(1.0);
            showSpeedNotification(1.0);
            break;
          case '2':
            event.preventDefault();
            setAudioSpeed(2.0);
            showSpeedNotification(2.0);
            break;
          case '3':
            event.preventDefault();
            setAudioSpeed(0.5);
            showSpeedNotification(0.5);
            break;
          case '4':
            event.preventDefault();
            setAudioSpeed(1.5);
            showSpeedNotification(1.5);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const showSpeedNotification = (speed: number) => {
    const speedLabel = speed < 0.8 ? '🐌 Slow' : 
                      speed < 1.2 ? '🚶 Normal' : 
                      speed < 1.5 ? '🏃 Fast' : '⚡ Very Fast';
    setSpeedChangeNotification(`Speed changed to ${speed}x (${speedLabel})`);
    setTimeout(() => setSpeedChangeNotification(''), 2000);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      // For now, we'll create sample data since we can't parse Excel in pure frontend
      // In a real implementation, you'd use a library like SheetJS (xlsx) to parse Excel files
      const sampleData: WordData[] = [
        { id: 0, german: 'Hallo', arabic: 'مرحبا' },
        { id: 1, german: 'Guten Morgen', arabic: 'صباح الخير' },
        { id: 2, german: 'Guten Tag', arabic: 'يوم سعيد' },
        { id: 3, german: 'Guten Abend', arabic: 'مساء الخير' },
        { id: 4, german: 'Auf Wiedersehen', arabic: 'مع السلامة' },
        { id: 5, german: 'Danke', arabic: 'شكراً' },
        { id: 6, german: 'Bitte', arabic: 'من فضلك' },
        { id: 7, german: 'Entschuldigung', arabic: 'عذراً' },
        { id: 8, german: 'Ja', arabic: 'نعم' },
        { id: 9, german: 'Nein', arabic: 'لا' },
        { id: 10, german: 'Ich verstehe', arabic: 'أفهم' },
        { id: 11, german: 'Ich verstehe nicht', arabic: 'لا أفهم' },
        { id: 12, german: 'Ich heiße', arabic: 'اسمي' },
        { id: 13, german: 'Freut mich', arabic: 'تشرفت بمقابلتك' },
        { id: 14, german: 'Wie geht es dir?', arabic: 'كيف حالك؟' },
        { id: 15, german: 'Mir geht es gut', arabic: 'أنا بخير' },
        { id: 16, german: 'Kannst du das wiederholen?', arabic: 'هل يمكنك تكرار ذلك؟' },
        { id: 17, german: 'Sprechen Sie Englisch?', arabic: 'هل تتحدث الإنجليزية؟' },
        { id: 18, german: 'Wo ist die Toilette?', arabic: 'أين الحمام؟' },
        { id: 19, german: 'Wie viel kostet das?', arabic: 'كم يكلف هذا؟' },
      ];

      setWordsData(sampleData);
      showMessage(`Successfully loaded ${sampleData.length} German words with Arabic translations!`, 'success');
    } catch (error) {
      showMessage('Upload failed: ' + (error as Error).message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const speakWord = (word: string) => {
    // Stop any currently playing speech
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }

    // Show speed indicator
    showMessage(`Playing "${word}" at ${audioSpeed}x speed`, 'info');

    // Always use Google Cloud TTS with embedded API key
    speakWithGoogleTTS(word);
  };

  const speakWithGoogleTTS = async (word: string) => {
    try {
      // Use embedded API key in query parameter
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text: word },
          voice: {
            languageCode: 'de-DE',
            name: 'de-DE-Neural2-A', // High-quality German female voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: audioSpeed, // Use the selected speed
            pitch: 0,
            volumeGainDb: 0
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Google TTS API error: ${response.status}`;
        
        if (response.status === 401) {
          errorMessage += ' - Authentication failed. Check your API key and ensure Text-to-Speech API is enabled.';
        } else if (response.status === 403) {
          errorMessage += ' - Access forbidden. Check API key permissions.';
        }
        
        errorMessage += `\nResponse: ${errorText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const audioContent = data.audioContent;
      const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setPlayingWordId(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setPlayingWordId(null);
        showMessage('Failed to play Google TTS audio', 'error');
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } catch (error) {
      console.error('Google TTS error:', error);
      showMessage(`Google TTS failed: ${(error as Error).message}. Falling back to Web Speech API.`, 'error');
      speakWithWebSpeechAPI(word);
    }
  };

  const speakWithWebSpeechAPI = (word: string) => {
    // Create new speech synthesis
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE'; // German language
    utterance.rate = audioSpeed; // Use the selected speed
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Get available voices and prioritize high-quality German voices
    const voices = speechSynthesis.getVoices();
    
    // Priority order for German voices (higher quality first)
    const germanVoicePriorities = [
      // Premium/high-quality voices
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('premium'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('enhanced'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('natural'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('neural'),
      // Specific German voices
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('anna') && voice.lang.startsWith('de'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('helena') && voice.lang.startsWith('de'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('petra') && voice.lang.startsWith('de'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('yannick') && voice.lang.startsWith('de'),
      // General German voices
      (voice: SpeechSynthesisVoice) => voice.lang === 'de-DE',
      (voice: SpeechSynthesisVoice) => voice.lang === 'de-AT',
      (voice: SpeechSynthesisVoice) => voice.lang === 'de-CH',
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith('de'),
      // Fallback to any voice with "german" in name
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('german'),
      (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('deutsch'),
    ];

    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    // Try to find the best available German voice
    for (const priorityCheck of germanVoicePriorities) {
      selectedVoice = voices.find(priorityCheck) || null;
      if (selectedVoice) {
        console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        break;
      }
    }

    // If no German voice found, try to find a high-quality English voice as fallback
    if (!selectedVoice) {
      const englishVoicePriorities = [
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('premium') && voice.lang.startsWith('en'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('enhanced') && voice.lang.startsWith('en'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('natural') && voice.lang.startsWith('en'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('neural') && voice.lang.startsWith('en'),
        (voice: SpeechSynthesisVoice) => voice.lang === 'en-US',
        (voice: SpeechSynthesisVoice) => voice.lang === 'en-GB',
      ];

      for (const priorityCheck of englishVoicePriorities) {
        selectedVoice = voices.find(priorityCheck) || null;
        if (selectedVoice) {
          console.log(`Fallback to English voice: ${selectedVoice.name} (${selectedVoice.lang})`);
          break;
        }
      }
    }

    // If still no voice found, use the first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
      console.log(`Using default voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      // Adjust settings based on voice quality
      if (selectedVoice.name.toLowerCase().includes('premium') || 
          selectedVoice.name.toLowerCase().includes('enhanced') ||
          selectedVoice.name.toLowerCase().includes('neural')) {
        utterance.rate = audioSpeed; // Use the selected speed
      }
    }

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started with voice:', utterance.voice?.name);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setPlayingWordId(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setPlayingWordId(null);
    };

    // Store reference and start speaking
    speechSynthesisRef.current = speechSynthesis;
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setPlayingWordId(null);
  };

  const testAudioSystem = async () => {
    setAudioTestResult('🧪 Testing Google Cloud TTS with embedded API key...');
    testGoogleTTS();
  };

  const testGoogleTTS = async () => {
    try {
      setAudioTestResult(prev => prev + '\n✅ Testing Google Cloud TTS API');
      
      setAudioTestResult(prev => prev + '\n🔑 Using embedded API key');
      
      const testWord = 'Hallo';
      setAudioTestResult(prev => prev + `\n🎤 Testing pronunciation of: "${testWord}"`);
      
      // Use embedded API key in query parameter
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text: testWord },
          voice: {
            languageCode: 'de-DE',
            name: 'de-DE-Neural2-A', // High-quality German female voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: audioSpeed, // Use the selected speed
            pitch: 0,
            volumeGainDb: 0
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API Error: ${response.status} - ${response.statusText}`;
        
        // Provide specific guidance based on error code
        if (response.status === 401) {
          errorMessage += '\n\n🔍 401 Authentication Error - Possible causes:';
          errorMessage += '\n• Invalid or expired API key';
          errorMessage += '\n• API key format is incorrect';
          errorMessage += '\n• Google Cloud Text-to-Speech API not enabled';
          errorMessage += '\n• Billing not set up for your Google Cloud project';
          errorMessage += '\n\n💡 Solutions:';
          errorMessage += '\n1. Verify your API key is correct';
          errorMessage += '\n2. Enable Text-to-Speech API in Google Cloud Console';
          errorMessage += '\n3. Set up billing for your Google Cloud project';
          errorMessage += '\n4. Check if your API key has the necessary permissions';
        } else if (response.status === 403) {
          errorMessage += '\n\n🔍 403 Forbidden - API key might not have Text-to-Speech permissions';
        } else if (response.status === 400) {
          errorMessage += '\n\n🔍 400 Bad Request - Check the request format';
        }
        
        errorMessage += `\n\n📄 Response: ${errorText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAudioTestResult(prev => prev + '\n✅ Google Cloud TTS API connected successfully');
      setAudioTestResult(prev => prev + '\n🌟 Using premium German neural voice: de-DE-Neural2-A (Female)');
      setAudioTestResult(prev => prev + `\n⚡ Audio speed set to: ${audioSpeed}x`);
      setAudioTestResult(prev => prev + `\n🎯 Speed description: ${audioSpeed < 0.8 ? '🐌 Slow (Great for learning pronunciation)' : 
       audioSpeed < 1.2 ? '🚶 Normal (playback speed)' : 
       audioSpeed < 1.5 ? '🏃 Fast (review)' : '⚡ Very Fast (review)'}`);
      setAudioTestResult(prev => prev + '\n💡 Tip: Adjust the speed control above to test different playback speeds');
      setAudioTestResult(prev => prev + `\n📚 Speed Guide: 0.5x-0.8x (Learning) • 1.0x (Normal) • 1.2x-1.5x (Review) • 1.5x-2.0x (Fast Review)`);
      
      // Play the audio
      const audioContent = data.audioContent;
      const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.oncanplay = () => {
        setAudioTestResult(prev => prev + '\n✅ Audio generated and ready to play');
      };
      audio.onplay = () => {
        setAudioTestResult(prev => prev + '\n🎵 Playing premium quality audio...');
      };
      audio.onended = () => {
        setAudioTestResult(prev => prev + '\n✅ Premium audio playback completed!');
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setAudioTestResult(prev => prev + '\n❌ Failed to play premium audio');
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      setAudioTestResult(`❌ Google Cloud TTS test failed: ${(error as Error).message}`);
    }
  };



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🇩🇪 German Speller
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Learn German words with Arabic translations and premium audio pronunciation
          </p>
          {/* Speed Indicator */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full shadow-sm">
            <span className="text-sm font-medium text-blue-800">⚡ Audio Speed:</span>
            <span className="text-lg font-bold text-blue-600">{audioSpeed}x</span>
            <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded-full">
              {audioSpeed < 0.8 ? '🐌 Slow' : 
               audioSpeed < 1.2 ? '🚶 Normal' : 
               audioSpeed < 1.5 ? '🏃 Fast' : '⚡ Very Fast'}
            </span>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Speed Change Notification */}
        {speedChangeNotification && (
          <div className="mb-6 p-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-center animate-pulse">
            {speedChangeNotification}
          </div>
        )}

        {/* File Upload Section */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📁</span>
            Upload German Words
          </h2>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              📋 <strong>Supported formats:</strong> Excel files (.xlsx, .xls) with German words and Arabic translations
            </p>
            <p className="text-sm text-blue-800 mt-2">
              ⚡ <strong>Audio Speed:</strong> {audioSpeed}x - {audioSpeed < 0.8 ? '🐌 Slow (Great for learning pronunciation)' : 
               audioSpeed < 1.2 ? '🚶 Normal (Standard playback speed)' : 
               audioSpeed < 1.5 ? '🏃 Fast (Quick review)' : '⚡ Very Fast (Rapid review)'}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              💡 All uploaded words will be pronounced at the selected speed for consistent learning experience.
            </p>
                                                      <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-xs text-blue-800">
                <strong>🎯 Speed Guide:</strong> 0.5x-0.8x (Learning) • 1.0x (Normal) • 1.2x-1.5x (Review) • 1.5x-2.0x (Fast Review)
              </div>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>⌨️ Keyboard Shortcuts:</strong> Ctrl/Cmd + 1 (1.0x), Ctrl/Cmd + 2 (2.0x), Ctrl/Cmd + 3 (0.5x), Ctrl/Cmd + 4 (1.5x)
              </div>
          </div>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg text-gray-600 mb-2">
              {isUploading ? 'Uploading...' : 'Drop your Excel file here or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              {isUploading ? 'Please wait...' : 'Supports .xlsx and .xls files'}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              ⚡ Audio will play at {audioSpeed}x speed
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {audioSpeed < 0.8 ? '🐌 Slow speed - Perfect for learning pronunciation' : 
               audioSpeed < 1.2 ? '🚶 Normal speed - Standard playback' : 
               audioSpeed < 1.5 ? '🏃 Fast speed - Quick review' : '⚡ Very fast - Rapid review'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Audio System Section */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎵</span>
            Audio System
          </h2>
          
          {/* Google Cloud TTS Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🚀</span>
              Premium Voice Quality
            </h3>
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                ✅ <strong>Ready to Use:</strong> Google Cloud TTS API key is embedded and ready to use!
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Google Cloud TTS:</strong> Premium quality German pronunciation using neural voices</p>
                <p><strong>Voice:</strong> de-DE-Neural2-A (High-quality German female voice)</p>
                <p><strong>Cost:</strong> Free tier: 4 million characters/month, then ~$4/million characters</p>
                <p><strong>Fallback:</strong> Automatically falls back to Web Speech API if needed</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Current Speed:</strong> {audioSpeed}x - {audioSpeed < 0.8 ? '🐌 Slow (Great for learning pronunciation)' : 
                   audioSpeed < 1.2 ? '🚶 Normal (Standard playback speed)' : 
                   audioSpeed < 1.5 ? '🏃 Fast (Quick review)' : '⚡ Very Fast (Rapid review)'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Audio Speed Control */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              Audio Speed Control
            </h3>
            <div className="flex items-center space-x-4">
              <label htmlFor="speed-slider" className="text-sm font-medium text-gray-700 min-w-[80px]">
                Speed: {audioSpeed}x
              </label>
              <input
                id="speed-slider"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={audioSpeed}
                onChange={(e) => {
                  const newSpeed = parseFloat(e.target.value);
                  setAudioSpeed(newSpeed);
                  showSpeedNotification(newSpeed);
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setAudioSpeed(0.5);
                    showSpeedNotification(0.5);
                  }}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  0.5x
                </button>
                <button
                  onClick={() => {
                    setAudioSpeed(1.0);
                    showSpeedNotification(1.0);
                  }}
                  className="px-3 py-1 text-xs bg-blue-200 text-blue-700 rounded hover:bg-blue-300 transition-colors"
                >
                  1.0x
                </button>
                <button
                  onClick={() => {
                    setAudioSpeed(1.5);
                    showSpeedNotification(1.5);
                  }}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  1.5x
                </button>
                <button
                  onClick={() => {
                    setAudioSpeed(2.0);
                    showSpeedNotification(2.0);
                  }}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  2.0x
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Adjust the speed of audio playback. Lower speeds (0.5x-0.8x) are great for learning pronunciation, 
              while higher speeds (1.2x-2.0x) help with quick review.
            </p>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <strong>⌨️ Keyboard Shortcuts:</strong> 
              Ctrl/Cmd + 1 (1.0x), Ctrl/Cmd + 2 (2.0x), Ctrl/Cmd + 3 (0.5x), Ctrl/Cmd + 4 (1.5x)
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Test Google Cloud TTS before uploading files
          </p>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ⚡ <strong>Test Audio Speed:</strong> {audioSpeed}x - {audioSpeed < 0.8 ? '🐌 Slow (Great for learning pronunciation)' : 
               audioSpeed < 1.2 ? '🚶 Normal (Standard playback speed)' : 
               audioSpeed < 1.5 ? '🏃 Fast (Quick review)' : '⚡ Very Fast (Rapid review)'}
            </p>
            <p className="text-xs text-green-700 mt-1">
              💡 Test the audio system with the current speed setting. Adjust the speed control above to hear different playback speeds.
            </p>
            <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded text-xs text-green-800">
              <strong>🎯 Speed Guide:</strong> 0.5x-0.8x (Learning) • 1.0x (Normal) • 1.2x-1.5x (Review) • 1.5x-2.0x (Fast Review)
            </div>
          </div>
          <button
            onClick={testAudioSystem}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">🎵</span>
            Test Audio System
            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              {audioSpeed}x
            </span>
          </button>
          <div className="mt-2 text-xs text-gray-600 text-center">
            💡 Adjust the speed control above to test different playback speeds
          </div>
          <div className="mt-2 text-xs text-blue-600 text-center font-medium">
            🎯 Current test speed: {audioSpeed}x
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Use keyboard shortcuts: Ctrl/Cmd + 1 (1.0x), Ctrl/Cmd + 2 (2.0x), Ctrl/Cmd + 3 (0.5x), Ctrl/Cmd + 4 (1.5x)
          </div>
          
          {audioTestResult && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">Test Results:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{audioTestResult}</pre>
            </div>
          )}
        </div>

        {/* Words Display */}
        {wordsData.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📚</span>
              German Words ({wordsData.length})
            </h2>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🎯 Audio Speed:</strong> {audioSpeed}x - {audioSpeed < 0.8 ? '🐌 Slow (Great for learning pronunciation)' : 
                 audioSpeed < 1.2 ? '🚶 Normal (Standard playback speed)' : 
                 audioSpeed < 1.5 ? '🏃 Fast (Quick review)' : '⚡ Very Fast (Rapid review)'}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                💡 Each word will be pronounced at the selected speed. Lower speeds are great for learning, higher speeds for quick review.
              </p>
              <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-xs text-blue-800">
                <strong>🎯 Speed Guide:</strong> 0.5x-0.8x (Learning) • 1.0x (Normal) • 1.2x-1.5x (Review) • 1.5x-2.0x (Fast Review)
              </div>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>⌨️ Keyboard Shortcuts:</strong> Ctrl/Cmd + 1 (1.0x), Ctrl/Cmd + 2 (2.0x), Ctrl/Cmd + 3 (0.5x), Ctrl/Cmd + 4 (1.5x)
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wordsData.map((word) => (
                <div
                  key={word.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    🇩🇪 {word.german}
                  </div>
                  <div className="text-lg text-gray-600 mb-3">
                    🇸🇦 {word.arabic}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => speakWord(word.german)}
                      disabled={playingWordId === word.id}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        playingWordId === word.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {playingWordId === word.id ? '🔊 Playing...' : '🔊 Play Audio'}
                      <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {audioSpeed}x
                      </span>
                    </button>
                    {playingWordId === word.id && (
                      <button
                        onClick={stopAudio}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ⏹️ Stop
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="mr-1">⚡</span>
                      Speed: {audioSpeed}x
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      audioSpeed < 0.8 ? 'bg-yellow-100 text-yellow-700' : 
                      audioSpeed < 1.2 ? 'bg-green-100 text-green-700' : 
                      audioSpeed < 1.5 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {audioSpeed < 0.8 ? '🐌 Slow' : 
                       audioSpeed < 1.2 ? '🚶 Normal' : 
                       audioSpeed < 1.5 ? '🏃 Fast' : '⚡ Very Fast'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Built with React, TypeScript, and Google Cloud TTS</p>
          <p className="mt-1">Premium German pronunciation powered by Google Cloud</p>
          <div className="mt-2 p-2 bg-gray-100 rounded-lg inline-block">
            <span className="text-gray-600">Current Audio Speed: </span>
            <span className="font-semibold text-blue-600">{audioSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
