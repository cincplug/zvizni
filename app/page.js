"use client";
import React, { useRef, useState } from "react";
import Analyzer from "./components/Analyzer";
import Visualizer from "./components/Visualizer";
import Controls from "./components/Controls";

export default function Home() {
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
      audioStream.getTracks().forEach((track) => track.stop());
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
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <h1 className="text-2xl font-bold mb-4">Zvuk - Audio Analyzer</h1>
      <div className="flex flex-col items-center">
        <Analyzer
          isAnalyzing={isAnalyzing}
          startAnalyzing={startAnalyzing}
          stopAnalyzing={stopAnalyzing}
        />
        <div
          className={`transition-all duration-300 ${
            isAnalyzing ? "h-auto" : "h-0"
          }`}
        >
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
      </div>
    </main>
  );
}
