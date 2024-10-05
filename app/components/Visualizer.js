import React, { useEffect, useRef } from "react";
import { visualizations } from "../utils/visualizations";

const Visualizer = ({ analyser, visualizationType, settings, onSettingsChange, settingsConfig }) => {
  const canvasRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let hue = 0;
    ctx.globalCompositeOperation = settings.composite;

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      hue = (hue + settings.colorFactor * deltaTime) % 360;

      const startFrequency = settings.minFrequency;
      const endFrequency = settings.maxFrequency;

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const minRadius = Math.max(
        (averageAmplitude / 256) * settings.maxRadius * 0.5,
        settings.minRadius
      );

      const drawShape = (drawFn) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) * settings.maxRadius;

        let prevX = centerX;
        let prevY = centerY;

        if (!settings.isMingle) {
          ctx.beginPath();
        }
        dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
          const size = Math.max((value / 256) * maxRadius, minRadius);
          const angle =
            ((i + startFrequency) / bufferLength) *
            settings.angleModifier *
            Math.PI;
          const x = centerX + size * Math.cos(angle);
          const y = centerY + size * Math.sin(angle);

          const avgX = (prevX + x) / 2;
          const avgY = (prevY + y) / 2;

          drawFn(avgX, avgY, size);
          prevX = x;
          prevY = y;
        });
        if (!settings.isMingle) {
          ctx.closePath();
        }

        ctx[
          settings.isFill ? "fillStyle" : "strokeStyle"
        ] = `hsla(${hue}, ${settings.saturation}%, ${settings.lightness}%, ${settings.alpha})`;

        ctx[settings.isFill ? "strokeStyle" : "fillStyle"] = settings.bgColor;
        ctx.lineWidth = settings.border;
        ctx.fill();
        ctx.stroke();
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize(ctx, drawShape, hue, settings);
      }
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyser, visualizationType, settings, onSettingsChange, settingsConfig]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: settings.bgColor
      }}
      className="w-screen h-screen"
    />
  );
};

export default Visualizer;
