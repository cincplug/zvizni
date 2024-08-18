"use client";

import React, { useRef, useState } from "react";
import Visualizer from "./Visualizer";
import Controls from "./Controls";

const Analyzer = () => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);
  const [audioStream, setAudioStream] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualizationType, setVisualizationType] = useState("stripes");

  const startAnalyzing = () => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1
        }
      })
      .then((stream) => {
        setAudioStream(stream);
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        gainNodeRef.current = audioContextRef.current.createGain();

        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        analyserRef.current.fftSize = 512;

        setIsAnalyzing(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const stopAnalyzing = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setAudioStream(null);
    setIsAnalyzing(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const handleVisualizationChange = (type) => {
    setVisualizationType(type);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-2">
        <h1 className="text-2xl font-bold mb-0">Zvuk</h1>
        <p>Audio analyzer prototype</p>
      </div>
      <button
        onClick={isAnalyzing ? stopAnalyzing : startAnalyzing}
        className={`px-4 py-2 mb-4 rounded ${isAnalyzing ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isAnalyzing ? 'Stop Analysis' : 'Start Analyzing'}
      </button>
      {isAnalyzing && (
        <>
          <Controls
            visualizationType={visualizationType}
            onVisualizationChange={handleVisualizationChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
          {analyserRef.current && (
            <Visualizer
              analyser={analyserRef.current}
              visualizationType={visualizationType}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Analyzer;
