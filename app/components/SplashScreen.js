import React from "react";
import Image from "next/image";
import { startAnalyzing } from "../utils/analysis";

const SplashScreen = ({
  onAnalysisStateChange,
  audioContextRef,
  sourceRef,
  analyserRef,
  gainNodeRef
}) => (
  <div className="flex flex-col items-center justify-center text-slate-100 p-4 rounded shadow-lg max-w-xs w-full">
    <div className="text-center">
      <Image
        src="/zvizni.png"
        alt="Zvizni logo"
        width="768"
        height="768"
        priority
      />
      <h1 className="text-6xl font-bold text-center">Zvizni</h1>
      <p className="text-md mb-4">Draw while making some sound</p>
    </div>
    <button
      onClick={() =>
        startAnalyzing(
          onAnalysisStateChange,
          audioContextRef,
          sourceRef,
          analyserRef,
          gainNodeRef
        )
      }
      className="px-4 py-2 rounded bg-blue-500 text-white w-3/4"
    >
      Start
    </button>
  </div>
);

export default SplashScreen;
