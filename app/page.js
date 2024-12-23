"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { configCommon } from "./configCommon";
import { config2d } from "./config2d";
import { config3d } from "./config3d";
import Menu from "./components/Menu";
import SplashScreen from "./components/SplashScreen";

const getConfig = (visualizationType) => {
  const specificConfig = visualizationType === "2d" ? config2d : config3d;
  const mergedConfig = [...configCommon, ...specificConfig];
  const configWithLoopType = mergedConfig.map((setting) => {
    if (setting.name === "loopType") {
      const allRangeInputs = mergedConfig.filter(
        (setting) => setting.type === "range"
      );

      return {
        ...setting,
        options: allRangeInputs.map((setting) => setting.name)
      };
    }
    return setting;
  });

  return configWithLoopType;
};

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [visualizationType, setVisualizationType] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [settings, setSettings] = useState({});
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (visualizationType) {
      const config = getConfig(visualizationType);
      const reducedConfig = config.reduce((acc, setting) => {
        acc[setting.name] = setting.value;
        return acc;
      }, {});

      setSettings(reducedConfig);
    }
  }, [visualizationType]);

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

  const RenderedVisualizer =
    visualizationType === "2d"
      ? dynamic(() => import("./components/Visualizer2d"))
      : dynamic(() => import("./components/Visualizer3d"));

  const config = getConfig(visualizationType);

  const loopedSetting =
    config.find((setting) => setting.name === settings.loopType) || null;

  return (
    <>
      <main
        className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-100"
        style={{ background: settings.bgColor }}
      >
        {isAnalyzing && analyser && (
          <>
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            <RenderedVisualizer
              {...{ analyser, settings, canvasRef, loopedSetting, rendererRef }}
            />
          </>
        )}

        {visualizationType ? (
          <Menu
            {...{
              isAnalyzing,
              volume,
              settings,
              config
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
