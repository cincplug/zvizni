import React from "react";

const Controls = ({
  visualizationType,
  onVisualizationChange,
  volume,
  onVolumeChange
}) => {
  return (
    <div className="text-center mb-4">
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
      <div className="flex justify-center mb-4">
        <button
          onClick={() => onVisualizationChange("stripes")}
          className={`px-4 py-2 mr-2 rounded ${
            visualizationType === "stripes"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Stripes
        </button>
        <button
          onClick={() => onVisualizationChange("line")}
          className={`px-4 py-2 mr-2 rounded ${
            visualizationType === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Line
        </button>
        <button
          onClick={() => onVisualizationChange("flower")}
          className={`px-4 py-2 rounded ${
            visualizationType === "flower"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Flower
        </button>
      </div>
    </div>
  );
};

export default Controls;
