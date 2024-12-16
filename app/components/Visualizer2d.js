import { useEffect, useRef } from "react";
import { visualizations } from "../utils/visualizations";

const targetFrameRate = 1000 / 60;

const Visualizer2d = ({ analyser, settings, canvasRef, loopedSetting }) => {
  const lastTimeRef = useRef(0);
  const settingsRef = useRef(settings);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        visualizations[shapeType]({
          ctx,
          i,
          totalPoints,
          x,
          y,
          prevX,
          prevY,
          size,
          settings: settingsRef.current
        });
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
    };

    const draw = (time) => {
      const deltaTime = time - lastTimeRef.current;

      if (deltaTime < targetFrameRate) {
        requestAnimationFrame(draw);
        return;
      }

      lastTimeRef.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      const barHeightScale = canvas.height / 2 / 255;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * barHeightScale;
        const x = i * barWidth;

        const y = canvas.height / 2 - barHeight / 2;
        getShape({ x, y });
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser, canvasRef, loopedSetting]);

  return null;
};

export default Visualizer2d;
