import React, { useEffect, useRef, useMemo } from "react";
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

  const memoizedSettings = useMemo(() => settings, [settings]);

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
    ctx.globalCompositeOperation = memoizedSettings.composite;

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      frameRef.current += 1;
      if (frameRef.current > 100) {
        frameRef.current = 1;
      }

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      hue = (hue + memoizedSettings.colorFactor * deltaTime * 0.01) % 360;

      const startFrequency = memoizedSettings.minFrequency;
      const endFrequency = memoizedSettings.maxFrequency;

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const minRadius = Math.max(
        (averageAmplitude / 256) * memoizedSettings.maxRadius * 0.5,
        memoizedSettings.minRadius
      );

      const drawShape = (drawFn) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius =
          Math.min(centerX, centerY) * memoizedSettings.maxRadius;

        let prevX = centerX;
        let prevY = centerY;

        if (!memoizedSettings.isMingle) {
          ctx.beginPath();
        }
        dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
          const size = Math.max((value / 256) * maxRadius, minRadius);
          const angle =
            ((i + startFrequency) / bufferLength) *
            memoizedSettings.angleModifier *
            Math.PI;
          const x = centerX + size * Math.cos(angle);
          const y = centerY + size * Math.sin(angle);

          const avgX = (prevX + x) / 2;
          const avgY = (prevY + y) / 2;

          drawFn(avgX, avgY, size);
          prevX = x;
          prevY = y;
        });
        if (!memoizedSettings.isMingle) {
          ctx.closePath();
        }

        ctx[
          memoizedSettings.isFill ? "fillStyle" : "strokeStyle"
        ] = `hsla(${hue}, ${memoizedSettings.saturation}%, ${memoizedSettings.lightness}%, ${memoizedSettings.alpha})`;

        ctx[memoizedSettings.isFill ? "strokeStyle" : "fillStyle"] =
          memoizedSettings.bgColor;
        ctx.lineWidth = memoizedSettings.border;
        ctx.fill();
        ctx.stroke();
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize(ctx, drawShape, hue, memoizedSettings);
      }
    };

    requestAnimationFrame(draw);
  }, [
    analyser,
    visualizationType,
    memoizedSettings,
    onSettingsChange,
    settingsConfig
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: memoizedSettings.bgColor
      }}
      className="w-screen h-screen"
    />
  );
};

export default Visualizer;
