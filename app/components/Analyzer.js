import React, { useRef } from 'react';

const Analyzer = ({ onAnalysisStateChange, volume }) => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  const startAnalyzing = () => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      })
      .then((stream) => {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        gainNodeRef.current = audioContextRef.current.createGain();

        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        analyserRef.current.fftSize = 512;
        gainNodeRef.current.gain.value = volume;

        onAnalysisStateChange(true, analyserRef.current);
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  };

  const stopAnalyzing = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    onAnalysisStateChange(false, null);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={analyserRef.current ? stopAnalyzing : startAnalyzing}
        className={`px-4 py-2 mb-4 rounded ${analyserRef.current ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {analyserRef.current ? 'Stop Analysis' : 'Start Analyzing'}
      </button>
    </div>
  );
};

export default Analyzer;