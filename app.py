import os
import pandas as pd
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import pyttsx3
import tempfile
import uuid
import json

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['AUDIO_FOLDER'] = 'audio_cache'

# Enable CORS
CORS(app)

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['AUDIO_FOLDER'], exist_ok=True)

# Store uploaded data in memory (in production, use a database)
words_data = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/debug')
def debug():
    return render_template('debug.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    global words_data
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'error': 'Please upload an Excel file (.xlsx or .xls)'}), 400
    
    try:
        # Read Excel file
        df = pd.read_excel(file)
        
        # Check if required columns exist
        if len(df.columns) < 2:
            return jsonify({'error': 'Excel file must have at least 2 columns (German word and Arabic translation)'}), 400
        
        # Process the data
        words_data = []
        for index, row in df.iterrows():
            german_word = str(row.iloc[0]).strip()
            arabic_translation = str(row.iloc[1]).strip()
            
            if german_word and arabic_translation and german_word != 'nan' and arabic_translation != 'nan':
                words_data.append({
                    'id': index,
                    'german': german_word,
                    'arabic': arabic_translation,
                    'audio_generated': False
                })
        
        print(f"Loaded {len(words_data)} words: {words_data}")  # Debug print
        
        return jsonify({
            'success': True,
            'message': f'Successfully loaded {len(words_data)} words',
            'count': len(words_data),
            'words': words_data  # Send the actual words data
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/words')
def get_words():
    return jsonify(words_data)

@app.route('/generate-audio/<int:word_id>')
def generate_audio(word_id):
    if word_id >= len(words_data):
        return jsonify({'error': 'Word not found'}), 404
    
    word_data = words_data[word_id]
    german_word = word_data['german']
    
    print(f"Generating audio for word {word_id}: '{german_word}'")
    
    # Generate unique filename
    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_path = os.path.join(app.config['AUDIO_FOLDER'], audio_filename)
    
    try:
        # Use gTTS directly (more reliable for German)
        print(f"Using gTTS to generate audio for: {german_word}")
        tts = gTTS(text=german_word, lang='de', slow=False)
        tts.save(audio_path)
        
        # Wait a moment for file to be written
        import time
        time.sleep(0.5)
        
        # Verify file was created
        if os.path.exists(audio_path) and os.path.getsize(audio_path) > 0:
            file_size = os.path.getsize(audio_path)
            print(f"✅ Audio generated successfully: {audio_path} (size: {file_size} bytes)")
        else:
            raise Exception("Audio file was not created or is empty")
        
        # Update word data
        word_data['audio_generated'] = True
        word_data['audio_file'] = audio_filename
        
        return jsonify({
            'success': True,
            'audio_file': audio_filename,
            'message': f'Audio generated for "{german_word}"',
            'file_size': file_size
        })
        
    except Exception as e:
        print(f"❌ Audio generation failed: {e}")
        return jsonify({'error': f'Error generating audio: {str(e)}'}), 500

@app.route('/audio/<filename>')
def serve_audio(filename):
    audio_path = os.path.join(app.config['AUDIO_FOLDER'], filename)
    print(f"🔊 Serving audio file: {filename}")
    print(f"   Full path: {audio_path}")
    print(f"   File exists: {os.path.exists(audio_path)}")
    
    if os.path.exists(audio_path):
        file_size = os.path.getsize(audio_path)
        print(f"   File size: {file_size} bytes")
        if file_size > 0:
            return send_file(audio_path, mimetype='audio/mpeg')
        else:
            print(f"   ❌ File is empty (0 bytes)")
            return jsonify({'error': 'Audio file is empty'}), 404
    else:
        print(f"   ❌ File not found")
        return jsonify({'error': 'Audio file not found'}), 404

@app.route('/test-audio')
def test_audio():
    """Test route to verify audio generation is working"""
    try:
        test_word = "Hallo"
        test_filename = "test_audio.mp3"  # Fixed filename for testing
        audio_path = os.path.join(app.config['AUDIO_FOLDER'], test_filename)
        
        print(f"🧪 Testing audio generation for: {test_word}")
        
        # Generate test audio
        tts = gTTS(text=test_word, lang='de', slow=False)
        tts.save(audio_path)
        
        if os.path.exists(audio_path) and os.path.getsize(audio_path) > 0:
            file_size = os.path.getsize(audio_path)
            print(f"✅ Test audio generated: {audio_path} (size: {file_size} bytes)")
            
            return jsonify({
                'success': True,
                'message': 'Audio generation test passed',
                'test_word': test_word,
                'file_size': file_size,
                'filename': test_filename
            })
        else:
            return jsonify({'error': 'Test audio generation failed'}), 500
            
    except Exception as e:
        print(f"❌ Test audio generation failed: {e}")
        return jsonify({'error': f'Test failed: {str(e)}'}), 500

@app.route('/clear-data')
def clear_data():
    global words_data
    words_data = []
    
    # Clear audio cache
    for filename in os.listdir(app.config['AUDIO_FOLDER']):
        file_path = os.path.join(app.config['AUDIO_FOLDER'], filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")
    
    return jsonify({'success': True, 'message': 'Data cleared successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
