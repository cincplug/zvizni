import React, { useEffect, useRef } from "react";

const CANVAS_WIDTH = 800; // Canvas breedte in pixels
const CANVAS_HEIGHT = 400; // Canvas hoogte in pixels

const Visualizer = ({ analyser, visualizationType }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      // Verkrijg de data van de frequentieanalyse
      analyser.getByteFrequencyData(dataArray);

      // Maak de canvas schoon voor nieuwe tekening
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (visualizationType === "stripes") {
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * (canvas.height / 256);

          canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      } else if (visualizationType === "line") {
        canvasCtx.beginPath();
        canvasCtx.moveTo(
          0,
          canvas.height - (dataArray[0] * canvas.height) / 256
        );

        for (let i = 1; i < bufferLength; i++) {
          const y = canvas.height - (dataArray[i] * canvas.height) / 256;
          const x = (i / bufferLength) * canvas.width;
          canvasCtx.lineTo(x, y);
        }

        canvasCtx.strokeStyle = "rgb(50, 50, 200)";
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
      }
    };

    draw();
  }, [analyser, visualizationType]);

  return (
    <canvas
      className="bg-slate-300"
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    ></canvas>
  );
};

export default Visualizer;
