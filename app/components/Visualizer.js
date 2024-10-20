import React, { useEffect, useRef } from "react";
import { visualizations } from "../utils/visualizations";
import { loopTypes } from "../utils/loopTypes";

const frameLimitX = window.innerWidth;
const frameLimitY = window.innerHeight;

const Visualizer = ({ analyser, settings, canvasRef }) => {
  const frameRef = useRef(1);
  const lastTimeRef = useRef(0);
  const mousePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const isDrawingRef = useRef(true);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

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

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const {
        loopType,
        thickness,
        startFrequency,
        endFrequency,
        angleRange,
        hue,
        saturation,
        lightness,
        alpha,
        isFill,
        border,
        bgColor,
        shapeType
      } = settingsRef.current;

      frameRef.current += 1;

      const { x, y } = loopTypes[loopType]({
        frame: frameRef.current,
        mousePos: mousePosRef.current
      });

      if (loopType === "x" && frameRef.current > frameLimitX) {
        frameRef.current = 0;
      }
      if (loopType === "y" && frameRef.current > frameLimitY) {
        frameRef.current = 0;
      }

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const seedRadiusValue = averageAmplitude * thickness;

      let prevX = x;
      let prevY = y;

      ctx.beginPath();

      const frequencyArray = dataArray.slice(startFrequency, endFrequency);
      const totalPoints = frequencyArray.length;

      frequencyArray.forEach((value, i) => {
        const size = Math.max(value * thickness, seedRadiusValue);
        visualizations[shapeType]({ctx, i, totalPoints, x, y, prevX, prevY, size, settings: settingsRef.current});
        prevX = x;
        prevY = y;
      });

      ctx[
        isFill ? "fillStyle" : "strokeStyle"
      ] = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

      ctx.closePath();
      ctx[isFill ? "strokeStyle" : "fillStyle"] = bgColor;
      ctx.fill();
      ctx.lineWidth = border;
      if (border > 0) {
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, [analyser, canvasRef]);

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
