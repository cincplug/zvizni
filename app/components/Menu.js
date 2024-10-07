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
            <div className="fixed top-4 right-4 bg-slate-700 text-slate-100 p-4 rounded shadow-lg max-w-xs w-full">
              <h2>Visualization modes</h2>
              <div className="grid grid-cols-3 gap-3 py-4">
                {visualizationModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onVisualizationChange(mode)}
                    className={`px-2 py-1 rounded ${
                      visualizationType === mode
                        ? "bg-green-500 text-white"
                        : "bg-slate-500"
                    } text-sm`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-3">
                {settingsConfig.map((setting) => (
                  <React.Fragment key={setting.name}>
                    <label className="col-span-5 text-sm">
                      {setting.label}
                    </label>
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
                          {parseFloat(settings[setting.name])}
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
              <div className="grid grid-cols-3 gap-3 py-4">
                <button
                  onClick={clearCanvas}
                  className="p-2 rounded bg-blue-500 text-white text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={saveCanvas}
                  className="p-2 rounded bg-green-600 text-white text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => stopAnalyzing(onAnalysisStateChange, audioContextRef)}
                  className="p-2 rounded bg-red-500 text-white text-sm"
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
            onClick={() => startAnalyzing(onAnalysisStateChange, audioContextRef, sourceRef, analyserRef, gainNodeRef)}
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
