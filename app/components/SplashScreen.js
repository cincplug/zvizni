import React from "react";
import Image from "next/image";
import { startAnalyzing } from "../utils/analysis";
import Footer from "./Footer";

const SplashScreen = ({
  onAnalysisStateChange,
  audioContextRef,
  sourceRef,
  analyserRef,
  gainNodeRef,
  setVisualizationType
}) => {
  const analyserProps = {
    onAnalysisStateChange,
    audioContextRef,
    sourceRef,
    analyserRef,
    gainNodeRef
  };
  return (
    <div className="flex flex-col items-center justify-center text-slate-100 p-4 rounded shadow-lg max-w-md w-full">
      <div className="text-center">
        <Image
          src="/zvizni.png"
          alt="Zvizni logo"
          width="768"
          height="768"
          priority
        />
        <h1 className="text-7xl font-bold text-center">Zvizni</h1>
        <p className="text-sm my-2">
          Make some sound or leave some other tab playing the sound
        </p>
        <p className="text-sm my-2">
          Meddle with options to customize your visualizing experience
        </p>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => {
            setVisualizationType("2d");
            startAnalyzing(analyserProps);
          }}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Start 2D
        </button>
        <button
          onClick={() => {
            setVisualizationType("3d");
            startAnalyzing(analyserProps);
          }}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Start 3D
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default SplashScreen;
