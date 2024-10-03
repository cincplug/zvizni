import React, { useEffect, useRef } from "react";

const Visualizer = ({ analyser, visualizationType, settings }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let hue = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      hue = (hue + settings.colorFactor) % 360;

      const startFrequency = settings.minFrequency;
      const endFrequency = settings.maxFrequency;

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

        ctx.beginPath();
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
        ctx.closePath();

        ctx[
          settings.isFill ? "fillStyle" : "strokeStyle"
        ] = `hsla(${hue}, ${settings.saturation}%, ${settings.lightness}%, ${settings.alpha})`;

        ctx[settings.isFill ? "strokeStyle" : "fillStyle"] = settings.bgColor;
        ctx.lineWidth = settings.border;
        ctx.fill();
        ctx.stroke();
      };

      const visualizations = {
        flower: () => {
          drawShape((x, y) => {
            ctx.lineTo(x, y);
          });
        },
        squares: () => {
          drawShape((x, y, size) => {
            ctx.rect(x - size / 2, y - size / 2, size, size);
          });
        },
        triangles: () => {
          drawShape((x, y, size) => {
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.closePath();
          });
        },
        circles: () => {
          drawShape((x, y, size) => {
            ctx.moveTo(x + size / 2, y);
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          });
        },
        hexagons: () => {
          drawShape((x, y, size) => {
            const side = size / 2;
            ctx.moveTo(x + side * Math.cos(0), y + side * Math.sin(0));
            for (let i = 1; i <= 6; i++) {
              ctx.lineTo(
                x + side * Math.cos((i * 2 * Math.PI) / 6),
                y + side * Math.sin((i * 2 * Math.PI) / 6)
              );
            }
          });
        },
        stars: () => {
          drawShape((x, y, size) => {
            const spikes = 5;
            const outerRadius = size;
            const innerRadius = size / 2;
            let rot = (Math.PI / 2) * 3;
            let step = Math.PI / spikes;

            ctx.moveTo(x, y - outerRadius);
            for (let i = 0; i < spikes; i++) {
              let xOuter = x + Math.cos(rot) * outerRadius;
              let yOuter = y + Math.sin(rot) * outerRadius;
              ctx.lineTo(xOuter, yOuter);
              rot += step;

              let xInner = x + Math.cos(rot) * innerRadius;
              let yInner = y + Math.sin(rot) * innerRadius;
              ctx.lineTo(xInner, yInner);
              rot += step;
            }
          });
        }
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
  }, [analyser, visualizationType, settings]);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: settings.bgColor, width: "100vw", height: "100vh" }}
    />
  );
};

export default Visualizer;
