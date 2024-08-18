import React, { useEffect, useRef } from "react";

const Visualizer = ({ analyser, visualizationType }) => {
  const canvasRef = useRef(null);

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

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const visualizations = {
        stripes: () => {
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;

          dataArray.forEach((value) => {
            const barHeight = value * (canvas.height / 256);
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          });
        },
        line: () => {
          canvasCtx.beginPath();
          canvasCtx.moveTo(0, canvas.height - (dataArray[0] * canvas.height) / 256);

          dataArray.forEach((value, i) => {
            const y = canvas.height - (value * canvas.height) / 256;
            const x = (i / bufferLength) * canvas.width;
            canvasCtx.lineTo(x, y);
          });

          canvasCtx.strokeStyle = "rgb(50, 50, 200)";
          canvasCtx.lineWidth = 2;
          canvasCtx.stroke();
        },
        flower: () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(centerX, centerY) * 4;

          canvasCtx.beginPath();
          dataArray.forEach((value, i) => {
            const radius = (value / 256) * maxRadius;
            const angle = (i / bufferLength) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
          });
          canvasCtx.closePath();
          canvasCtx.strokeStyle = "rgb(50, 0, 100)";
          canvasCtx.lineWidth = 2;
          canvasCtx.stroke();
        },
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
  }, [analyser, visualizationType]);

  return (
    <canvas
      className="bg-slate-300"
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh" }}
    ></canvas>
  );
};

export default Visualizer;
