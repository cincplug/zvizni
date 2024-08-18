"use client";
import React, { useState } from "react";
import Analyzer from "./components/Analyzer";
import Visualizer from "./components/Visualizer";
import Controls from "./components/Controls";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [visualizationType, setVisualizationType] = useState("stripes");
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
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-slate-200">
      <h1 className="text-2xl font-bold mb-4">Zvuk - Audio Analyzer</h1>
      <div className="flex flex-col items-center">
        <Analyzer
          onAnalysisStateChange={handleAnalysisStateChange}
          volume={volume}
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
              {analyser && (
                <Visualizer
                  analyser={analyser}
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
