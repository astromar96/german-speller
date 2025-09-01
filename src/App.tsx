import React, { useState, useRef } from 'react';

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
  const [usePremiumAPI, setUsePremiumAPI] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [useFreeAPI, setUseFreeAPI] = useState(false);
  const [freeApiKey, setFreeApiKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
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

    if (usePremiumAPI && apiKey) {
      speakWithGoogleTTS(word);
    } else if (useFreeAPI && freeApiKey) {
      speakWithVoiceRSS(word);
    } else {
      speakWithWebSpeechAPI(word);
    }
  };

  const speakWithGoogleTTS = async (word: string) => {
    try {
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          input: { text: word },
          voice: {
            languageCode: 'de-DE',
            name: 'de-DE-Neural2-B', // High-quality German voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.8,
            pitch: 0,
            volumeGainDb: 0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status}`);
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
      showMessage('Google TTS failed, falling back to Web Speech API', 'error');
      speakWithWebSpeechAPI(word);
    }
  };

  const speakWithVoiceRSS = async (word: string) => {
    try {
      const response = await fetch(`https://api.voicerss.org/?key=${freeApiKey}&hl=de-de&src=${encodeURIComponent(word)}&c=MP3&f=44khz_16bit_stereo`);
      if (!response.ok) {
        throw new Error(`VoiceRSS API error: ${response.status}`);
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setPlayingWordId(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setPlayingWordId(null);
        showMessage('Failed to play VoiceRSS audio', 'error');
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } catch (error) {
      console.error('VoiceRSS error:', error);
      showMessage('VoiceRSS failed, falling back to Web Speech API', 'error');
      speakWithWebSpeechAPI(word);
    }
  };

  const speakWithWebSpeechAPI = (word: string) => {
    // Create new speech synthesis
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE'; // German language
    utterance.rate = 0.7; // Slower for better pronunciation
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

    let selectedVoice = null;
    
    // Try to find the best available German voice
    for (const priorityCheck of germanVoicePriorities) {
      selectedVoice = voices.find(priorityCheck);
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
        selectedVoice = voices.find(priorityCheck);
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
        utterance.rate = 0.8; // Slightly faster for premium voices
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
      showMessage('Speech synthesis error: ' + event.error, 'error');
    };

    // Start speaking
    speechSynthesis.speak(utterance);
    speechSynthesisRef.current = speechSynthesis;
  };

  const playAudio = (wordId: number) => {
    const word = wordsData.find(w => w.id === wordId);
    if (!word) return;

    setPlayingWordId(wordId);
    speakWord(word.german);
  };

  const stopAudio = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setPlayingWordId(null);
  };

  const testAudioSystem = async () => {
    if (usePremiumAPI && apiKey) {
      setAudioTestResult('🧪 Testing Google Cloud TTS...');
      testGoogleTTS();
    } else if (useFreeAPI && freeApiKey) {
      setAudioTestResult('🧪 Testing VoiceRSS...');
      testVoiceRSS();
    } else {
      setAudioTestResult('🧪 Testing Web Speech API...');
      testWebSpeechAPI();
    }
  };

  const testGoogleTTS = async () => {
    try {
      setAudioTestResult(prev => prev + '\n✅ Testing Google Cloud TTS API');
      
      const testWord = 'Hallo';
      setAudioTestResult(prev => prev + `\n🎤 Testing pronunciation of: "${testWord}"`);
      
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          input: { text: testWord },
          voice: {
            languageCode: 'de-DE',
            name: 'de-DE-Neural2-B',
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.8,
            pitch: 0,
            volumeGainDb: 0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setAudioTestResult(prev => prev + '\n✅ Google Cloud TTS API connected successfully');
      setAudioTestResult(prev => prev + '\n🌟 Using premium German neural voice: de-DE-Neural2-B');
      
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

  const testVoiceRSS = async () => {
    try {
      setAudioTestResult(prev => prev + '\n✅ Testing VoiceRSS API');
      
      const testWord = 'Hallo';
      setAudioTestResult(prev => prev + `\n🎤 Testing pronunciation of: "${testWord}"`);
      
      const response = await fetch(`https://api.voicerss.org/?key=${freeApiKey}&hl=de-de&src=${encodeURIComponent(testWord)}&c=MP3&f=44khz_16bit_stereo`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.oncanplay = () => {
        setAudioTestResult(prev => prev + '\n✅ Audio generated and ready to play');
      };
      audio.onplay = () => {
        setAudioTestResult(prev => prev + '\n🎵 Playing VoiceRSS audio...');
      };
      audio.onended = () => {
        setAudioTestResult(prev => prev + '\n✅ VoiceRSS audio playback completed!');
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setAudioTestResult(prev => prev + '\n❌ Failed to play VoiceRSS audio');
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      setAudioTestResult(`❌ VoiceRSS test failed: ${(error as Error).message}`);
    }
  };

  const testWebSpeechAPI = async () => {
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        setAudioTestResult('❌ Web Speech API is not supported in this browser');
        return;
      }

      setAudioTestResult(prev => prev + '\n✅ Web Speech API is supported');

      // Get available voices
      const voices = speechSynthesis.getVoices();
      setAudioTestResult(prev => prev + `\n📢 Found ${voices.length} available voices`);

      // Show all available voices for debugging
      setAudioTestResult(prev => prev + '\n\n🎭 Available voices:');
      voices.forEach((voice, index) => {
        const quality = voice.name.toLowerCase().includes('premium') || 
                       voice.name.toLowerCase().includes('enhanced') || 
                       voice.name.toLowerCase().includes('neural') ? '🌟' : '📻';
        setAudioTestResult(prev => prev + `\n${quality} ${voice.name} (${voice.lang})`);
      });

      // Test with a simple German word
      const testWord = 'Hallo';
      setAudioTestResult(prev => prev + `\n\n🎤 Testing pronunciation of: "${testWord}"`);

      const utterance = new SpeechSynthesisUtterance(testWord);
      utterance.lang = 'de-DE';
      utterance.rate = 0.7;

      // Use the same voice selection logic as the main function
      const germanVoicePriorities = [
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('premium'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('enhanced'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('natural'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('neural'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('anna') && voice.lang.startsWith('de'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('helena') && voice.lang.startsWith('de'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('petra') && voice.lang.startsWith('de'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('yannick') && voice.lang.startsWith('de'),
        (voice: SpeechSynthesisVoice) => voice.lang === 'de-DE',
        (voice: SpeechSynthesisVoice) => voice.lang === 'de-AT',
        (voice: SpeechSynthesisVoice) => voice.lang === 'de-CH',
        (voice: SpeechSynthesisVoice) => voice.lang.startsWith('de'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('german'),
        (voice: SpeechSynthesisVoice) => voice.name.toLowerCase().includes('deutsch'),
      ];

      let selectedVoice: SpeechSynthesisVoice | null = null;
      for (const priorityCheck of germanVoicePriorities) {
        const foundVoice = voices.find(priorityCheck);
        if (foundVoice) {
          selectedVoice = foundVoice;
          const quality = foundVoice.name.toLowerCase().includes('premium') || 
                         foundVoice.name.toLowerCase().includes('enhanced') || 
                         foundVoice.name.toLowerCase().includes('neural') ? '🌟 Premium' : '📻 Standard';
          setAudioTestResult(prev => prev + `\n🇩🇪 Selected: ${foundVoice.name} (${foundVoice.lang}) - ${quality}`);
          break;
        }
      }

      if (!selectedVoice) {
        setAudioTestResult(prev => prev + '\n⚠️ No German voice found, will use fallback');
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setAudioTestResult(prev => prev + '\n✅ Speech started!');
      };

      utterance.onend = () => {
        setAudioTestResult(prev => prev + '\n✅ Speech completed successfully!');
      };

      utterance.onerror = (event) => {
        setAudioTestResult(prev => prev + `\n❌ Speech error: ${event.error}`);
      };

      // Start the test
      speechSynthesis.speak(utterance);

    } catch (error) {
      setAudioTestResult(`❌ Test failed: ${(error as Error).message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 text-blue-600 mr-3 text-4xl">🌍</div>
            <h1 className="text-4xl font-bold text-gray-900">
              German Speller
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Learn German words with Arabic translations and audio pronunciation
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Frontend-only version using Web Speech API
          </p>
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

        {/* Audio Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="mr-2">🎧</span>
            Audio System Test
          </h2>
          
          {/* Premium API Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🌟</span>
              Premium Voice Quality
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="premium-api"
                  checked={usePremiumAPI}
                  onChange={(e) => setUsePremiumAPI(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="premium-api" className="text-sm font-medium">
                  Use Google Cloud TTS (Premium Quality)
                </label>
              </div>
              
              {usePremiumAPI && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Google Cloud API Key:
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google Cloud API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600">
                    Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p><strong>Web Speech API:</strong> Free, basic quality, works offline</p>
                <p><strong>Google Cloud TTS:</strong> Premium quality, requires API key, costs ~$4/million characters</p>
              </div>
            </div>
          </div>

          {/* Free API Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🌟</span>
              Free Voice Quality
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="free-api"
                  checked={useFreeAPI}
                  onChange={(e) => setUseFreeAPI(e.target.checked)}
                  className="mr-3 h-4 w-4 text-green-600 rounded"
                />
                <label htmlFor="free-api" className="text-sm font-medium">
                  Use VoiceRSS (Free Quality)
                </label>
              </div>
              
              {useFreeAPI && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    VoiceRSS API Key:
                  </label>
                  <input
                    type="password"
                    value={freeApiKey}
                    onChange={(e) => setFreeApiKey(e.target.value)}
                    placeholder="Enter your VoiceRSS API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-600">
                    Get your API key from <a href="https://www.voicerss.org/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">VoiceRSS</a>
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p><strong>Web Speech API:</strong> Free, basic quality, works offline</p>
                <p><strong>VoiceRSS:</strong> Free, requires API key, works globally, limited to 1000 characters/day</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Test if {usePremiumAPI ? 'Google Cloud TTS' : useFreeAPI ? 'VoiceRSS' : 'Web Speech API'} is working before uploading files
          </p>
          <button
            onClick={testAudioSystem}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">🎵</span>
            Test Audio System
          </button>
          {audioTestResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{audioTestResult}</pre>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="mr-2">📁</span>
            Upload Excel File
          </h2>
          <p className="text-gray-600 mb-4">
            Upload an Excel file with German words and Arabic translations
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg text-gray-600 mb-2">
              Drop your Excel file here or click to browse
            </p>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Choose File
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Supports .xlsx and .xls files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Processing file...</span>
            </div>
          )}
        </div>

        {/* Words Display */}
        {wordsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📚</span>
              German Words ({wordsData.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wordsData.map((word) => (
                <div key={word.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{word.german}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#{word.id}</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-right text-lg" dir="rtl">
                      {word.arabic}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => playingWordId === word.id ? stopAudio() : playAudio(word.id)}
                      className={`w-full px-4 py-2 rounded-md transition-colors ${
                        playingWordId === word.id 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {playingWordId === word.id ? (
                        <>
                          ⏹️ Stop
                        </>
                      ) : (
                        <>
                          🔊 Play Audio
                        </>
                      )}
                    </button>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      🌟 Premium voices available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>German Speller - Frontend-only version with Web Speech API</p>
        </div>
      </div>
    </div>
  );
}

export default App;
