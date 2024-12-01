import React, { useRef, useState } from "react";
import Image from "next/image";
import { settingsConfig } from "../settingsConfig";
import MenuToggle from "./MenuToggle";
import { startAnalyzing, stopAnalyzing } from "../utils/analysis";
import { visualizations } from "../utils/visualizations";

const visualizationModes = Object.keys(visualizations);

const Menu = ({
  isAnalyzing,
  onAnalysisStateChange,
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
      {isAnalyzing ? (
        <>
          <MenuToggle
            isMenuVisible={isMenuVisible}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
          {isMenuVisible && (
            <div className="fixed top-0 left-0 right-0 md:left-auto md:w-80 bg-slate-700 text-slate-100 px-2 shadow-lg max-h-1/3 overflow-y-auto">
              <h2 className="mt-2">Zvizni</h2>
              <div className="grid grid-cols-3 gap-2">
                {settingsConfig.map((setting) => (
                  <div key={setting.name}>
                    <label className="text-xs truncate">{setting.label}</label>
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
                          className="max-w-full"
                        />
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
                        className="bg-transparent"
                      />
                    )}
                    {setting.type === "select" && (
                      <select
                        name={setting.name}
                        value={settings[setting.name]}
                        onChange={handleChange}
                        className="max-w-full bg-white text-black text-xs rounded"
                      >
                        {setting.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
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
      ) : (
        <footer class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-slate-300">
          By{" "}
          <a
            href="https://cincplug.com/"
            target="_blank"
            rel="noreferrer noopener"
            class="underline"
          >
            Luka Činč
          </a>
        </footer>
      )}

      {!isAnalyzing && (
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
      )}
    </div>
  );
};

export default Menu;
