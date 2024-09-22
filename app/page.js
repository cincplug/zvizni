"use client";
import React, { useState } from "react";
import Visualizer from "./components/Visualizer";
import Controls from "./components/Controls";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [visualizationType, setVisualizationType] = useState("flower");
  const [analyser, setAnalyser] = useState(null);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-100">
      <Controls
        isAnalyzing={isAnalyzing}
        onAnalysisStateChange={handleAnalysisStateChange}
        visualizationType={visualizationType}
        onVisualizationChange={handleVisualizationChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
      {isAnalyzing && analyser && (
        <Visualizer analyser={analyser} visualizationType={visualizationType} />
      )}
    </main>
  );
}
