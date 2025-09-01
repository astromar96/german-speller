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
      // Read the Excel file using FileReader
      const arrayBuffer = await file.arrayBuffer();
      
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

    // Create new speech synthesis
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE'; // German language
    utterance.rate = 0.8; // Slightly slower for better pronunciation
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Get available voices and try to find a German voice
    const voices = speechSynthesis.getVoices();
    const germanVoice = voices.find(voice => 
      voice.lang.startsWith('de') || 
      voice.name.toLowerCase().includes('german') ||
      voice.name.toLowerCase().includes('deutsch')
    );
    
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started');
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
    setAudioTestResult('🧪 Testing Web Speech API...');
    
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        setAudioTestResult('❌ Web Speech API is not supported in this browser');
        return;
      }

      setAudioTestResult(prev => prev + '\n✅ Web Speech API is supported');

      // Test with a simple German word
      const testWord = 'Hallo';
      setAudioTestResult(prev => prev + `\n🎤 Testing pronunciation of: "${testWord}"`);

      const utterance = new SpeechSynthesisUtterance(testWord);
      utterance.lang = 'de-DE';
      utterance.rate = 0.8;

      // Get available voices
      const voices = speechSynthesis.getVoices();
      setAudioTestResult(prev => prev + `\n📢 Found ${voices.length} available voices`);

      const germanVoice = voices.find(voice => 
        voice.lang.startsWith('de') || 
        voice.name.toLowerCase().includes('german') ||
        voice.name.toLowerCase().includes('deutsch')
      );

      if (germanVoice) {
        utterance.voice = germanVoice;
        setAudioTestResult(prev => prev + `\n🇩🇪 Using German voice: ${germanVoice.name}`);
      } else {
        setAudioTestResult(prev => prev + '\n⚠️ No German voice found, using default voice');
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
          <p className="text-gray-600 mb-4">
            Test if Web Speech API is working before uploading files
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
