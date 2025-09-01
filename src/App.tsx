import React, { useState, useRef } from 'react';

interface WordData {
  id: number;
  german: string;
  arabic: string;
  audio_generated?: boolean;
  audio_file?: string;
}

function App() {
  const [wordsData, setWordsData] = useState<WordData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [audioTestResult, setAudioTestResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setWordsData(data.words || []);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      showMessage('Upload failed: ' + (error as Error).message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const generateAudio = async (wordId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/generate-audio/${wordId}`);
      const data = await response.json();

      if (data.success) {
        setWordsData(prev => prev.map(word => 
          word.id === wordId 
            ? { ...word, audio_generated: true, audio_file: data.audio_file }
            : word
        ));
        showMessage(data.message, 'success');
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      showMessage('Audio generation failed: ' + (error as Error).message, 'error');
    }
  };

  const playAudio = async (wordId: number) => {
    const word = wordsData.find(w => w.id === wordId);
    if (!word || !word.audio_file) return;

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(`http://localhost:5001/audio/${word.audio_file}`);
      
      audio.onplay = () => {
        setPlayingWordId(wordId);
        setCurrentAudio(audio);
      };

      audio.onended = () => {
        setPlayingWordId(null);
        setCurrentAudio(null);
      };

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        showMessage('Failed to play audio', 'error');
        setPlayingWordId(null);
        setCurrentAudio(null);
      };

      await audio.play();
    } catch (error) {
      if ((error as Error).name === 'NotAllowedError') {
        showMessage('Click the play button again to start audio (browser autoplay policy)', 'info');
      } else {
        showMessage('Failed to play audio: ' + (error as Error).message, 'error');
      }
      setPlayingWordId(null);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setPlayingWordId(null);
    setCurrentAudio(null);
  };

  const testAudioSystem = async () => {
    setAudioTestResult('🧪 Testing audio system...');
    
    try {
      // Step 1: Generate test audio
      const response = await fetch('http://localhost:5001/test-audio');
      const data = await response.json();
      
      if (data.success) {
        setAudioTestResult(prev => prev + `\n✅ Audio generated successfully (${data.file_size} bytes)`);
        
        // Step 2: Try to play it
        const audio = new Audio(`http://localhost:5001/audio/${data.filename}`);
        
        audio.oncanplay = () => {
          setAudioTestResult(prev => prev + '\n✅ Audio can be loaded');
        };
        
        audio.onplay = () => {
          setAudioTestResult(prev => prev + '\n✅ Audio playback started!');
        };
        
        audio.onerror = (e) => {
          setAudioTestResult(prev => prev + `\n❌ Audio error: ${(e as any).message || 'Unknown error'}`);
        };
        
        audio.onended = () => {
          setAudioTestResult(prev => prev + '\n✅ Audio playback completed!');
        };
        
        // Try to play
        await audio.play().catch(error => {
          if (error.name === 'NotAllowedError') {
            setAudioTestResult(prev => prev + '\n⚠️ Browser blocked autoplay. Click the test button again to play.');
          } else {
            setAudioTestResult(prev => prev + `\n❌ Playback failed: ${error.message}`);
          }
        });
        
      } else {
        setAudioTestResult(`❌ Audio generation failed: ${data.error}`);
      }
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
          <p className="text-gray-600 mb-4">Test if audio is working before uploading files</p>
          <button 
            onClick={testAudioSystem}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            🎵 Test Audio System
          </button>
          {audioTestResult && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{audioTestResult}</pre>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="mr-2">📁</span>
            Upload Excel File
          </h2>
          <p className="text-gray-600 mb-4">Upload an Excel file with German words and Arabic translations</p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="text-6xl mb-4">📊</div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-lg font-medium text-gray-700 mb-2">
                {isUploading ? 'Uploading...' : 'Drop your Excel file here or click to browse'}
              </div>
              <button 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Supports .xlsx and .xls files
            </p>
          </div>
        </div>

        {/* Words Display */}
        {wordsData.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Words ({wordsData.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wordsData.map((word) => (
                <div key={word.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                      #{word.id + 1}
                    </span>
                    {word.audio_generated && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        Audio Ready
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">German</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {word.german}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Arabic</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1" dir="rtl">
                        {word.arabic}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {!word.audio_generated ? (
                      <button
                        onClick={() => generateAudio(word.id)}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        🎵 Generate Audio
                      </button>
                    ) : (
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
                            ▶️ Play
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>German Speller - Learn German with Audio Pronunciation</p>
        </div>
      </div>
    </div>
  );
}

export default App;
