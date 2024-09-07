import React, { useEffect, useRef, useState, useCallback } from "react";

const Visualizer = ({ analyser, visualizationType }) => {
  const canvasRef = useRef(null);

  const settingsConfig = [
    {
      name: "centerModifierX",
      label: "Center Modifier X",
      min: 0,
      max: 2,
      step: 0.01,
      value: 1
    },
    {
      name: "centerModifierY",
      label: "Center Modifier Y",
      min: 0,
      max: 2,
      step: 0.01,
      value: 1
    },
    {
      name: "maxRadius",
      label: "Max Radius",
      min: 1,
      max: 10,
      step: 0.1,
      value: 4
    },
    {
      name: "angleModifier",
      label: "Angle Modifier",
      min: 1,
      max: 10,
      step: 0.1,
      value: 2
    },
    {
      name: "sensitivity",
      label: "Sensitivity",
      min: 1,
      max: 100,
      step: 0.1,
      value: 5
    }
  ];

  const initialSettings = settingsConfig.reduce((acc, setting) => {
    acc[setting.name] = setting.value;
    return acc;
  }, {});

  const [settings, setSettings] = useState(initialSettings);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: parseFloat(value)
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let hue = 0;

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgba(255, 255, 255, 0.01)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      hue = (hue + 1) % 360;

      const startFrequency = 40;
      const endFrequency = bufferLength - startFrequency;

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const minRadius = Math.max(
        (averageAmplitude / 256) * settings.maxRadius * 0.5,
        settings.sensitivity
      );

      const visualizations = {
        line: () => {
          canvasCtx.beginPath();
          canvasCtx.moveTo(
            0,
            canvas.height - (dataArray[startFrequency] * canvas.height) / 256
          );

          dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
            const y = canvas.height - (value * canvas.height) / 256;
            const x = ((i + startFrequency) / bufferLength) * canvas.width;
            canvasCtx.lineTo(x, y);
          });
        },
        flower: () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(centerX, centerY) * settings.maxRadius;

          let prevX = centerX;
          let prevY = centerY;

          canvasCtx.beginPath();
          dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
            const radius = Math.max((value / 256) * maxRadius, minRadius);
            const angle =
              ((i + startFrequency) / bufferLength) *
              settings.angleModifier *
              Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const avgX = (prevX + x) / 2;
            const avgY = (prevY + y) / 2;

            canvasCtx.lineTo(avgX, avgY);

            prevX = x;
            prevY = y;
          });
          canvasCtx.closePath();
          canvasCtx.fillStyle = `hsla(${hue}, 100%, 50%, 0.5)`;
          canvasCtx.fill();
        }
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize();
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyser, visualizationType, settings]);

  return (
    <>
      <canvas
        className="bg-slate-300"
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh" }}
      ></canvas>
      <div className="fixed top-4 left-4 shadow-lg rounded p-4 bg-white bg-opacity-80 grid grid-cols-12 gap-4 w-64 items-center">
        {settingsConfig.map((setting) => (
          <React.Fragment key={setting.name}>
            <label className="col-span-5">{setting.label}</label>
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
            <span className="col-span-2 text-right">
              {settings[setting.name]}
            </span>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Visualizer;
