import React, { useRef, useState } from "react";
import { settingsConfig } from "../settingsConfig";
import MenuToggle from "./MenuToggle";
import { startAnalyzing, stopAnalyzing } from "../utils/analysis";

const visualizationModes = [
  "flower",
  "squares",
  "circles",
  "triangles",
  "hexagons",
  "stars"
];

const Menu = ({
  isAnalyzing,
  onAnalysisStateChange,
  visualizationType,
  onVisualizationChange,
  settings,
  onSettingsChange,
  clearCanvas,
  saveCanvas
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
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

  return (
    <div className="relative">
      {isAnalyzing && (
        <>
          <MenuToggle
            isMenuVisible={isMenuVisible}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
          {isMenuVisible && (
            <div className="fixed bottom-0 left-0 right-0 md:left-auto md:w-80 bg-slate-700 text-slate-100 px-2 rounded-t-lg shadow-lg max-h-1/3 overflow-y-auto">
              <div className="grid grid-cols-3 gap-1 py-2">
                {visualizationModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onVisualizationChange(mode)}
                    className={`px-1 py-1 rounded text-xs ${
                      visualizationType === mode
                        ? "bg-green-500 text-white"
                        : "bg-slate-500"
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {settingsConfig.map(
                  (setting) =>
                    setting.type === "range" && (
                      <div key={setting.name}>
                        <label className="text-xs truncate">
                          {setting.label}
                        </label>
                        <input
                          type="range"
                          name={setting.name}
                          min={setting.min}
                          max={setting.max}
                          step={setting.step}
                          value={settings[setting.name]}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    )
                )}
              </div>
              <div className="grid grid-cols-3 gap-1 py-2">
                <button
                  onClick={clearCanvas}
                  className="p-1 rounded bg-blue-500 text-white text-xs"
                >
                  Clear
                </button>
                <button
                  onClick={saveCanvas}
                  className="p-1 rounded bg-green-600 text-white text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    stopAnalyzing(onAnalysisStateChange, audioContextRef)
                  }
                  className="p-1 rounded bg-red-500 text-white text-xs"
                >
                  Stop
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!isAnalyzing && (
        <div className="flex flex-col items-center justify-center text-slate-100 p-4 rounded shadow-lg max-w-xs w-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-center">Zvizni</h1>
            <p className="text-sm mb-4">audio visualization prototype</p>
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
      )}
    </div>
  );
};

export default Menu;
