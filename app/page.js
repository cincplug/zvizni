"use client";
import React, { useState, useRef } from "react";
import Visualizer from "./components/Visualizer";
import Controls from "./components/Menu";
import { settingsConfig } from "./settingsConfig";

export default function Home() {
  const defaultSettings = settingsConfig.reduce((acc, setting) => {
    acc[setting.name] = setting.value;
    return acc;
  }, {});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [visualizationType, setVisualizationType] = useState("flower");
  const [analyser, setAnalyser] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const canvasRef = useRef(null);

  const handleAnalysisStateChange = (isAnalyzing, analyser) => {
    setIsAnalyzing(isAnalyzing);
    setAnalyser(analyser);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleVisualizationChange = (type) => {
    setVisualizationType(type);
  };

  const handleSettingsChange = (updatedSettings) => {
    setSettings(updatedSettings);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "visualization.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-100">
      <Controls
        isAnalyzing={isAnalyzing}
        onAnalysisStateChange={handleAnalysisStateChange}
        visualizationType={visualizationType}
        onVisualizationChange={handleVisualizationChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        clearCanvas={clearCanvas}
        saveCanvas={saveCanvas}
      />
      {isAnalyzing && analyser && (
        <Visualizer
          analyser={analyser}
          visualizationType={visualizationType}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          settingsConfig={settingsConfig}
          canvasRef={canvasRef}
        />
      )}
    </main>
  );
}
