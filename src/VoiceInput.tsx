// VoiceInput.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styles

const VoiceInput: React.FC = () => {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();

  recognition.onstart = () => {
    console.log('Listening...');
    setIsRecording(true);
  };

  recognition.onresult = (event: any) => {
    const audio = event.results[0][0].transcript;
    setAudioData(audio);

    // Send the audio data to the backend for processing
    sendAudioDataToBackend(audio);
  };

  const startRecording = () => {
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
  };

  const sendAudioDataToBackend = async (audio: string) => {
    try {
      console.log('Sending audio data to backend:', audio); // Add this log
      const response = await axios.post('http://localhost:3001/voice-command', { audio });
  
      if (response.data.success) {
        console.log('Command executed successfully');
      } else {
        console.error('Error executing command:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending audio data to the backend:', error);
    }
  };

  return (
    <div className="voice-input-container">
      <div className="voice-input-content">
        <h1>Voice Command Interface</h1>
        <div className={`voice-pulse ${isRecording ? 'pulse-animation' : ''}`}></div>
        <button
          className={`voice-input-button ${isRecording ? 'recording' : ''}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          {isRecording ? 'Listening...' : 'Click and Hold to Record'}
        </button>
        {audioData && <p className="audio-data">You said: "{audioData}"</p>}
      </div>
    </div>
  );
};

export default VoiceInput;
