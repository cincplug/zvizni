import React, { useRef } from "react";
import { settingsConfig } from "../settingsConfig";

const visualizationModes = [
  "flower",
  "squares",
  "circles",
  "triangles",
  "hexagons",
  "stars"
];

const Controls = ({
  isAnalyzing,
  onAnalysisStateChange,
  visualizationType,
  onVisualizationChange,
  settings,
  onSettingsChange
}) => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onSettingsChange((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value
    }));
  };

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

        analyserRef.current.fftSize = 1024;
        gainNodeRef.current.gain.value = 1;

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
      className={`${
        isAnalyzing
          ? "fixed top-4 right-4"
          : "flex flex-col items-center justify-center"
      } bg-slate-700 text-slate-100 p-4 rounded shadow-lg max-w-xs w-full`}
    >
      {!isAnalyzing && (
        <div className="text-center">
          <h1 className="text-6xl font-bold text-center">Zvizni</h1>
          <p className="text-sm mb-4">audio visualization prototype</p>
        </div>
      )}
      <button
        onClick={isAnalyzing ? stopAnalyzing : startAnalyzing}
        className={`px-4 py-2 mb-4 rounded ${
          isAnalyzing ? "bg-red-500" : "bg-blue-500"
        } text-white w-full`}
      >
        {isAnalyzing ? "Stop" : "Start"} Zvizni
      </button>

      {isAnalyzing && (
        <>
          <div className="flex flex-wrap justify-center mb-4">
            {visualizationModes.map((mode) => (
              <button
                key={mode}
                onClick={() => onVisualizationChange(mode)}
                className={`px-2 py-1 m-1 rounded ${
                  visualizationType === mode
                    ? "bg-blue-600 text-white"
                    : "bg-slate-500"
                } text-sm`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-4">
            {settingsConfig.map((setting) => (
              <React.Fragment key={setting.name}>
                <label className="col-span-5 text-sm">{setting.label}</label>
                {setting.type === "range" && (
                  <>
                    <input
                      type="range"
                      name={setting.name}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      value={settings[setting.name]}
                      onChange={handleChange}
                      className="col-span-5"
                    />
                    <span className="col-span-2 text-right text-sm">
                      {settings[setting.name]}
                    </span>
                  </>
                )}
                {setting.type === "checkbox" && (
                  <div className="col-span-5 flex justify-start">
                    <input
                      type="checkbox"
                      name={setting.name}
                      checked={settings[setting.name]}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {setting.type === "color" && (
                  <input
                    type="color"
                    name={setting.name}
                    value={settings[setting.name]}
                    onChange={handleChange}
                    className="col-span-5"
                  />
                )}
                {setting.type === "select" && (
                  <select
                    name={setting.name}
                    value={settings[setting.name]}
                    onChange={handleChange}
                    className="col-span-7 bg-white text-black text-sm rounded"
                  >
                    {setting.options.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Controls;
