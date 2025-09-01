#!/usr/bin/env python3
"""
Test script to verify audio generation functionality
"""

import os
import sys
import uuid

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_pyttsx3():
    """Test pyttsx3 TTS functionality"""
    try:
        import pyttsx3
        print("✅ pyttsx3 imported successfully")
        
        # Initialize the TTS engine
        engine = pyttsx3.init()
        print("✅ TTS engine initialized")
        
        # Get available voices
        voices = engine.getProperty('voices')
        print(f"✅ Found {len(voices)} available voices")
        
        # List voice details
        for i, voice in enumerate(voices):
            print(f"  Voice {i}: {voice.name} ({voice.id})")
            if 'german' in voice.name.lower() or 'de' in voice.id.lower():
                print(f"    -> German voice found!")
        
        # Test audio generation
        test_word = "Hallo"
        test_filename = f"test_{uuid.uuid4()}.mp3"
        
        print(f"✅ Testing audio generation for '{test_word}'...")
        
        # Set properties
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 0.9)
        
        # Generate audio
        engine.save_to_file(test_word, test_filename)
        engine.runAndWait()
        
        # Check if file was created
        if os.path.exists(test_filename) and os.path.getsize(test_filename) > 0:
            print(f"✅ Audio file created successfully: {test_filename}")
            print(f"   File size: {os.path.getsize(test_filename)} bytes")
            
            # Clean up test file
            os.remove(test_filename)
            print("✅ Test file cleaned up")
        else:
            print("❌ Audio file creation failed")
            
    except Exception as e:
        print(f"❌ pyttsx3 test failed: {e}")

def test_gtts():
    """Test gTTS functionality"""
    try:
        from gtts import gTTS
        print("✅ gTTS imported successfully")
        
        # Test with a simple word
        test_word = "Hallo"
        test_filename = f"test_gtts_{uuid.uuid4()}.mp3"
        
        print(f"✅ Testing gTTS for '{test_word}'...")
        
        # Create TTS object
        tts = gTTS(text=test_word, lang='de', slow=False)
        
        # Save audio
        tts.save(test_filename)
        
        # Check if file was created
        if os.path.exists(test_filename) and os.path.getsize(test_filename) > 0:
            print(f"✅ gTTS audio file created: {test_filename}")
            print(f"   File size: {os.path.getsize(test_filename)} bytes")
            
            # Clean up test file
            os.remove(test_filename)
            print("✅ gTTS test file cleaned up")
        else:
            print("❌ gTTS audio file creation failed")
            
    except Exception as e:
        print(f"❌ gTTS test failed: {e}")

def main():
    """Run all tests"""
    print("🔊 Testing Audio Generation Functionality")
    print("=" * 50)
    
    print("\n1. Testing pyttsx3 (offline TTS):")
    test_pyttsx3()
    
    print("\n2. Testing gTTS (online TTS):")
    test_gtts()
    
    print("\n" + "=" * 50)
    print("🎯 Test completed! Check the results above.")
    print("\n💡 If both tests pass, your audio functionality is working!")
    print("💡 If pyttsx3 fails, gTTS will be used as fallback (requires internet)")

if __name__ == "__main__":
    main()
