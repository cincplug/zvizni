import React, { useEffect, useRef } from "react";
import { visualizations } from "../utils/visualizations";

const Visualizer = ({
  analyser,
  visualizationType,
  settings,
  onSettingsChange,
  settingsConfig,
  canvasRef
}) => {
  const frameRef = useRef(1);
  const lastTimeRef = useRef(0);
  const mousePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (event) => {
      if (isDrawingRef.current) {
        mousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseDown = () => {
      isDrawingRef.current = true;
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      if (isDrawingRef.current) {
        const touch = event.touches[0];
        mousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      isDrawingRef.current = true;
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      isDrawingRef.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const {
      composite,
      hue,
      startFrequency,
      endFrequency,
      petalRadius,
      seedRadius,
      angleModifier,
      isFill,
      saturation,
      lightness,
      alpha,
      bgColor,
      border,
    } = settings;
    ctx.globalCompositeOperation = composite;

    const draw = (time) => {
      if (!isDrawingRef.current) {
        requestAnimationFrame(draw);
        return;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      frameRef.current += 1;
      if (frameRef.current > 100) {
        frameRef.current = 1;
      }

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const seedRadiusValue = Math.max(
        averageAmplitude * petalRadius,
        seedRadius
      );

      const drawShape = (drawFn) => {
        let prevX = mousePosRef.current.x;
        let prevY = mousePosRef.current.y;

        ctx.beginPath();
        dataArray.slice(startFrequency, endFrequency).forEach((value, i) => {
          const size = Math.max(
            value * petalRadius,
            seedRadiusValue
          );
          const angle =
            ((i + startFrequency) / bufferLength) * angleModifier * Math.PI;
          const x = mousePosRef.current.x + size * Math.cos(angle);
          const y = mousePosRef.current.y + size * Math.sin(angle);

          const avgX = (prevX + x) / 2;
          const avgY = (prevY + y) / 2;

          drawFn(avgX, avgY, size);
          prevX = x;
          prevY = y;
        });

        const adjustedHue = (hue + deltaTime) % 360;
        ctx[
          isFill ? "fillStyle" : "strokeStyle"
        ] = `hsla(${adjustedHue}, ${saturation}%, ${lightness}%, ${alpha})`;

        ctx.closePath();
        ctx[isFill ? "strokeStyle" : "fillStyle"] = bgColor;
        ctx.fill();
        ctx.lineWidth = border;
        if (border > 0) {
          ctx.stroke();
        }
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize(ctx, drawShape, hue, settings);
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, [
    analyser,
    visualizationType,
    settings,
    onSettingsChange,
    settingsConfig,
    canvasRef
  ]);

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
