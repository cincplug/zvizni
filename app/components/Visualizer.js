import React, { useEffect, useRef } from "react";
import { visualizations } from "../utils/visualizations";

const Visualizer = ({
  analyser,
  visualizationType,
  settings,
  onSettingsChange,
  settingsConfig
}) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(1);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let hue = 0;
    const {
      composite,
      colorFactor,
      startFrequency,
      endFrequency,
      petalRadius,
      seedRadius,
      angleModifier,
      isClutter,
      isFill,
      saturation,
      lightness,
      alpha,
      bgColor,
      border
    } = settings;
    ctx.globalCompositeOperation = composite;

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      frameRef.current += 1;
      if (frameRef.current > 100) {
        frameRef.current = 1;
      }

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      hue = (hue + colorFactor * deltaTime * 0.01) % 360;

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const seedRadiusValue = Math.max(
        (averageAmplitude / 1024) * petalRadius,
        seedRadius
      );

      const drawShape = (drawFn) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const petalRadiusValue = Math.min(centerX, centerY) * petalRadius;

        let prevX = centerX;
        let prevY = centerY;

        if (!isClutter) {
          ctx.beginPath();
        }
        dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
          const size = Math.max(
            (value / 256) * petalRadiusValue,
            seedRadiusValue
          );
          const angle =
            ((i + startFrequency) / bufferLength) * angleModifier * Math.PI;
          const x = centerX + size * Math.cos(angle);
          const y = centerY + size * Math.sin(angle);

          const avgX = (prevX + x) / 2;
          const avgY = (prevY + y) / 2;

          drawFn(avgX, avgY, size);
          prevX = x;
          prevY = y;
        });
        if (!isClutter) {
          ctx.closePath();
        }

        ctx[
          isFill ? "fillStyle" : "strokeStyle"
        ] = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

        ctx[isFill ? "strokeStyle" : "fillStyle"] = bgColor;
        ctx.lineWidth = border;
        ctx.fill();
        ctx.stroke();
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize(ctx, drawShape, hue, settings);
      }
    };

    requestAnimationFrame(draw);
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
