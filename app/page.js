"use client";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Menu from "./components/Menu";
import SplashScreen from "./components/SplashScreen";
import { settingsConfig } from "./settingsConfig";

const updatedSettingsConfig = settingsConfig.map((setting) => {
  if (setting.name === "loopType") {
    return {
      ...setting,
      options: settingsConfig
        .filter((setting) => setting.type === "range")
        .map((setting) => setting.name)
    };
  }
  return setting;
});

export default function Home() {
  const defaultSettings = updatedSettingsConfig.reduce((acc, setting) => {
    acc[setting.name] = setting.value;
    return acc;
  }, {});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [visualizationType, setVisualizationType] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  const handleAnalysisStateChange = (isAnalyzing, analyser) => {
    setIsAnalyzing(isAnalyzing);
    setAnalyser(analyser);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
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

  const loopedSetting = settingsConfig.find(
    (setting) => setting.name === settings.loopType
  );

  const RenderedVisualizer =
    visualizationType === "2d"
      ? dynamic(() => import("./components/Visualizer2d"))
      : dynamic(() => import("./components/Visualizer3d"));

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-100">
        {isAnalyzing && analyser && (
          <RenderedVisualizer
            {...{ analyser, settings, loopedSetting, canvasRef }}
          />
        )}

        {visualizationType ? (
          <Menu
            {...{
              isAnalyzing,
              volume,
              settings,
              settingsConfig: updatedSettingsConfig,
              clearCanvas,
              saveCanvas
            }}
            onAnalysisStateChange={handleAnalysisStateChange}
            onVolumeChange={handleVolumeChange}
            onSettingsChange={handleSettingsChange}
          />
        ) : (
          <SplashScreen
            onAnalysisStateChange={handleAnalysisStateChange}
            audioContextRef={audioContextRef}
            sourceRef={sourceRef}
            analyserRef={analyserRef}
            gainNodeRef={gainNodeRef}
            setVisualizationType={setVisualizationType}
          />
        )}
      </main>
    </>
  );
}
