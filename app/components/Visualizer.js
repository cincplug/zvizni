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
  const isDrawingRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
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
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
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
      thickness,
      angleRange,
      isFill,
      saturation,
      lightness,
      alpha,
      bgColor,
      border,
      hasMouseX,
      hasMouseY
    } = settings;
    ctx.globalCompositeOperation = composite;

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const frameLimitX = window.innerWidth;
      const frameLimitY = window.innerHeight;

      frameRef.current += 1;

      if (!hasMouseX && frameRef.current > frameLimitX) {
        frameRef.current = 0;
      }
      if (!hasMouseY && frameRef.current > frameLimitY) {
        frameRef.current = 0;
      }

      let x, y;
      if (hasMouseX && hasMouseY) {
        x = mousePosRef.current.x;
        y = mousePosRef.current.y;
      } else if (hasMouseX) {
        x = mousePosRef.current.x;
        y = frameRef.current;
      } else if (hasMouseY) {
        x = frameRef.current;
        y = mousePosRef.current.y;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const seedRadiusValue = averageAmplitude * thickness;

      const drawShape = (drawFn) => {
        let prevX = x;
        let prevY = y;

        ctx.beginPath();

        const pointsInFullCircle = dataArray.slice(
          startFrequency,
          endFrequency
        );
        const totalPoints = pointsInFullCircle.length;

        pointsInFullCircle.forEach((value, i) => {
          const size = Math.max(value * thickness, seedRadiusValue);
          const angle = (i / totalPoints) * angleRange;

          const pointX = x + size * Math.cos(angle);
          const pointY = y + size * Math.sin(angle);

          const avgX = (prevX + pointX) / 2;
          const avgY = (prevY + pointY) / 2;

          drawFn(avgX, avgY, size);
          prevX = pointX;
          prevY = pointY;
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
