import React, { useEffect, useRef } from "react";

const Visualizer = ({ analyser, visualizationType, settings }) => {
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

    let hue = 0;
    let rotationAngle = 0;

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.translate(canvas.width / 2, canvas.height / 2);
      canvasCtx.rotate((rotationAngle * Math.PI) / 180);
      canvasCtx.translate(-canvas.width / 2, -canvas.height / 2);

      canvasCtx.fillStyle = "rgba(255, 255, 255, 0.01)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      hue = (hue + 1) % 360;
      rotationAngle = (rotationAngle + settings.frameRotation) % 360;

      const startFrequency = 40;
      const endFrequency = bufferLength - startFrequency;

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

        canvasCtx.beginPath();
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
        canvasCtx.closePath();
        canvasCtx.fillStyle = `hsla(${hue}, 100%, 80%, 0.5)`;
        canvasCtx.fill();
      };

      const visualizations = {
        flower: () => {
          drawShape((x, y, size) => {
            canvasCtx.lineTo(x, y);
          });
        },
        squares: () => {
          drawShape((x, y, size) => {
            canvasCtx.rect(x - size / 2, y - size / 2, size, size);
          });
        },
        triangles: () => {
          drawShape((x, y, size) => {
            canvasCtx.moveTo(x, y - size / 2);
            canvasCtx.lineTo(x - size / 2, y + size / 2);
            canvasCtx.lineTo(x + size / 2, y + size / 2);
            canvasCtx.closePath();
          });
        },
        circles: () => {
          drawShape((x, y, size) => {
            canvasCtx.moveTo(x + size / 2, y);
            canvasCtx.arc(x, y, size / 2, 0, Math.PI * 2);
          });
        },
      };

      const visualize = visualizations[visualizationType];
      if (visualize) {
        visualize();
      }

      canvasCtx.restore();
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyser, visualizationType, settings]);

  return <canvas className="bg-slate-800" ref={canvasRef}></canvas>;
};

export default Visualizer;
