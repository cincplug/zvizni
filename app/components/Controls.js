import React, { useRef, useState } from "react";
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
  const [isMenuVisible, setIsMenuVisible] = useState(true); // State for menu visibility
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onSettingsChange((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? e.target.checked : value
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
    <div className="relative">
      {isAnalyzing && (
        <button
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          className="fixed top-4 right-4 z-50 bg-slate-700 text-slate-100 p-2 rounded-full shadow-lg"
        >
          {isMenuVisible ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      )}

      {isMenuVisible && (
        <div
          className={`${
            isAnalyzing
              ? "fixed top-4 right-4 bg-slate-700"
              : "flex flex-col items-center justify-center"
          } text-slate-100 p-4 rounded shadow-lg max-w-xs w-full`}
        >
          {!isAnalyzing && (
            <div className="text-center">
              <h1 className="text-6xl font-bold text-center">Zvizni</h1>
              <p className="text-sm mb-4">audio visualization prototype</p>
            </div>
          )}
          <button
            onClick={isAnalyzing ? stopAnalyzing : startAnalyzing}
            className={`px-4 py-2 rounded ${
              isAnalyzing ? "bg-red-500" : "bg-blue-500"
            } text-white w-3/4`} 
          >
            {isAnalyzing ? "Stop" : "Start"} Zvizni
          </button>

          {isAnalyzing && (
            <>
              <div className="flex flex-wrap justify-start my-4"> 
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
                          className="col-span-4"
                        />
                        <span className="col-span-3 text-right text-sm">
                          {parseFloat(settings[setting.name]).toFixed(2)}
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
      )}
    </div>
  );
};

export default Controls;
