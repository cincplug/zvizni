import React from "react";

const Analyzer = ({ isAnalyzing, startAnalyzing, stopAnalyzing }) => {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isAnalyzing ? stopAnalyzing : startAnalyzing}
        className={`px-4 py-2 mb-4 rounded ${
          isAnalyzing ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        {isAnalyzing ? "Stop Analysis" : "Start Analyzing"}
      </button>
    </div>
  );
};

export default Analyzer;
