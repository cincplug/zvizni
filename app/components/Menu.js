import React, { useRef, useState } from "react";
import MenuToggle from "./MenuToggle";
import SplashScreen from "./SplashScreen";
import Chips from "./Chips";

const Menu = ({
  isAnalyzing,
  onAnalysisStateChange,
  settings,
  config,
  onSettingsChange
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
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

  const nonSelectSettings = config.filter(
    (setting) => setting.type !== "select"
  );
  const selectSettings = config.filter((setting) => setting.type === "select");

  return (
    <div className="relative">
      {isAnalyzing ? (
        <>
          <MenuToggle
            isMenuVisible={isMenuVisible}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
          {isMenuVisible && (
            <div className="fixed top-0 left-0 right-0 md:left-auto md:w-80 bg-slate-700 text-slate-100 p-2 shadow-lg max-h-1/3 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {nonSelectSettings.map((setting) => (
                  <div key={setting.name}>
                    <label className="text-xs truncate w-full flex justify-between">
                      <span>{setting.label}</span>
                      {setting.type === "range" && (
                        <span>{settings[setting.name]}</span>
                      )}
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
                  </div>
                ))}
                {selectSettings.map((setting) => (
                  <Chips
                    key={setting.name}
                    setting={setting}
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      {!isAnalyzing && (
        <SplashScreen
          onAnalysisStateChange={onAnalysisStateChange}
          audioContextRef={audioContextRef}
          sourceRef={sourceRef}
          analyserRef={analyserRef}
          gainNodeRef={gainNodeRef}
        />
      )}
    </div>
  );
};

export default Menu;
