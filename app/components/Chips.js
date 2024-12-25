import React from "react";

const Chips = ({ setting, settings, onSettingsChange }) => {
  return (
    <div className="col-span-3">
      <label className="text-xs truncate w-full flex justify-between mb-1">
        <span>{setting.label}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {setting.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`px-2 py-1 rounded text-xs ${
              settings[setting.name] === option
                ? "bg-blue-500 text-white"
                : "bg-slate-500 text-white"
            }`}
            onClick={() =>
              onSettingsChange((prevSettings) => ({
                ...prevSettings,
                [setting.name]: option
              }))
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chips;
