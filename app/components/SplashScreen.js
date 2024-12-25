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
        <div className="flex items-center justify-between w-full">
          <Image
            src="/zvizni-splash.png"
            alt="Zvizni logo mirror"
            className="w-full h-auto"
            priority
            width={0}
            height={0}
            sizes="25vw"
          />
        </div>
        <h1 className="text-7xl font-bold text-center z-10">Zvizni</h1>
        <p className="text-sm my-2">
          Make some sound or use the sound from another browser tab
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
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          Start 2D
        </button>
        <button
          onClick={() => {
            setVisualizationType("3d");
            startAnalyzing(analyserProps);
          }}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Start 3D
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default SplashScreen;
