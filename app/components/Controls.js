import React, { useRef } from "react";

const visualizationModes = ["line", "flower"];

const Controls = ({
  isAnalyzing,
  onAnalysisStateChange,
  visualizationType,
  onVisualizationChange,
  volume,
  onVolumeChange
}) => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

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
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        gainNodeRef.current = audioContextRef.current.createGain();

        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        analyserRef.current.fftSize = 512;
        gainNodeRef.current.gain.value = volume;

        onAnalysisStateChange(true, analyserRef.current);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const stopAnalyzing = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    onAnalysisStateChange(false, null);
  };

  return (
    <div
      className={`flex flex-col items-center mb-4 ${
        isAnalyzing
          ? "fixed top-4 right-4 bg-slate-700 text-slate-100 p-4 rounded shadow-lg"
          : "justify-center"
      }`}
    >
      {!isAnalyzing && (
        <h1 className="text-2xl font-bold mb-4">Zvuk - Audio Analyzer</h1>
      )}
      <button
        onClick={isAnalyzing ? stopAnalyzing : startAnalyzing}
        className={`px-4 py-2 mb-4 rounded ${
          isAnalyzing ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        {isAnalyzing ? "Stop" : "Start"}
      </button>
      {isAnalyzing && (
        <>
          <label className="block mb-2">
            Volume:
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="ml-2"
            />
          </label>
          <div className="flex justify-center">
            {visualizationModes.map((mode) => (
              <button
                key={mode}
                onClick={() => onVisualizationChange(mode)}
                className={`px-4 py-2 mr-2 rounded ${
                  visualizationType === mode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Controls;
