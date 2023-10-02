import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const VoiceInput: React.FC = () => {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [displayBoxes, setDisplayBoxes] = useState<string[]>([]);
  const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = `${newTheme}-theme`;
  };

  const addBox = (color: string) => {
    setDisplayBoxes(prevBoxes => [...prevBoxes, color]);
  };

  const removeBox = (color: string) => {
    setDisplayBoxes(prevBoxes => prevBoxes.filter(boxColor => boxColor !== color));
  };

  recognition.onstart = () => {
    console.log('Listening...');
    setIsRecording(true);
  };

  recognition.onresult = async (event: any) => {
    const audio = event.results[0][0].transcript;
    setAudioData(audio);

    const response = await sendAudioDataToBackend(audio);

    if (response.success) {
      console.log('Command executed successfully:', response.command);

      if (response.command.startsWith('addBox(') && response.command.endsWith(')')) {
        const color = response.command.substring(8, response.command.length - 2);
        addBox(color);
      }
      else if (response.command.startsWith('removeBox(') && response.command.endsWith(')')) {
        const color = response.command.substring(11, response.command.length - 2);
        removeBox(color);
      }
      else if (response.command === 'toggleTheme') {
        toggleTheme();
      }
      else if (response.command === 'clearUI()') {
        setDisplayBoxes([]);
      }
      
    } else {
      console.error('Error executing command:', response.error);
    }
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
      console.log('Sending audio data to backend:', audio);
      const response = await axios.post('http://localhost:3001/voice-command', { audio });

      return response.data;
    } catch (error) {
      console.error('Error sending audio data to the backend:', error);
      return { success: false, error: 'Error sending audio data to the backend' };
    }
  };

  return (
    <div className={`${theme}-theme`}>
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
      <div className="box-container">
        {displayBoxes.map((color, index) => (
          <div key={index} className="box" style={{ backgroundColor: color }}></div>
        ))}
      </div>
    </div>
  );
};

export default VoiceInput;
