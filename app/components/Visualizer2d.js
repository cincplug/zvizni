import { useEffect, useRef } from "react";
import { get2dVisualization } from "../utils/get2dVisualization";

const targetFrameRate = 1000 / 60;

const Visualizer2d = ({ analyser, settings, canvasRef, loopedSetting }) => {
  const lastTimeRef = useRef(0);
  const settingsRef = useRef(settings);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const getShape = ({ x, y }) => {
      const {
        thickness,
        startFrequency,
        endFrequency,
        hue,
        saturation,
        lightness,
        alpha,
        isFill,
        border,
        bgColor,
        shapeType,
        loopType
      } = settingsRef.current;

      if (settingsRef.current[loopType] < loopedSetting.max) {
        settingsRef.current[loopType] += loopedSetting.step;
      } else {
        settingsRef.current[loopType] = loopedSetting.min;
      }

      analyser.getByteFrequencyData(dataArrayRef.current);

      const averageAmplitude =
        dataArrayRef.current.reduce((sum, value) => sum + value, 0) /
        dataArrayRef.current.length;
      const seedRadiusValue = averageAmplitude * thickness;

      const { width, height } = canvas;
      let prevX = x;
      let prevY = y;

      ctx.beginPath();

      const frequencyArray = dataArrayRef.current.slice(
        startFrequency,
        endFrequency
      );
      const totalPoints = frequencyArray.length;

      frequencyArray.forEach((value, i) => {
        const size = Math.max(value * thickness, seedRadiusValue);
        get2dVisualization[shapeType]({
          ctx,
          i,
          totalPoints,
          x,
          y,
          prevX,
          prevY,
          size,
          width,
          height,
          settings: settingsRef.current
        });
      });

      ctx[
        isFill ? "fillStyle" : "strokeStyle"
      ] = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.closePath();
      ctx[isFill ? "strokeStyle" : "fillStyle"] = bgColor;
      if (isFill) ctx.fill();
      ctx.lineWidth = border;

      if (border > 0) {
        ctx.stroke();
      }
    };

    let animationFrameId;

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;

      if (deltaTime < targetFrameRate) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      lastTimeRef.current = time;

      if (settingsRef.current.doesRefresh) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const gap = parseInt(settingsRef.current.gap);
      const usableWidth = canvas.width - gap * 2;
      const barWidth = usableWidth / bufferLength;

      analyser.getByteFrequencyData(dataArrayRef.current);
      const barHeightScale = canvas.height / 2 / 255;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArrayRef.current[i] * barHeightScale;
        const x = gap + i * barWidth; // Start after left gap
        const y = canvas.height / 2 - barHeight / 2;
        getShape({ x, y });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    analyser,
    canvasRef,
    loopedSetting.max,
    loopedSetting.min,
    loopedSetting.step
  ]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  return null;
};

export default Visualizer2d;
