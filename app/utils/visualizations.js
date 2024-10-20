export const visualizations = {
  flowers: ({ ctx, i, totalPoints, size, x, y, prevX, prevY, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const pointX = x + size * Math.cos(angle);
    const pointY = y + size * Math.sin(angle);

    const avgX = (prevX + pointX) / 2;
    const avgY = (prevY + pointY) / 2;

    ctx.lineTo(avgX, avgY);
  },
  squares: ({ ctx, x, y, size }) => {
    ctx.rect(x - size / 2, y - size / 2, size, size);
  },
  triangles: ({ ctx, x, y, size }) => {
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
  },
  circles: ({ ctx, x, y, size }) => {
    ctx.moveTo(x + size / 2, y);
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  },
  hexagons: ({ ctx, x, y, size }) => {
    const side = size / 2;
    ctx.moveTo(x + side * Math.cos(0), y + side * Math.sin(0));
    for (let i = 1; i <= 6; i++) {
      ctx.lineTo(
        x + side * Math.cos((i * 2 * Math.PI) / 6),
        y + side * Math.sin((i * 2 * Math.PI) / 6)
      );
    }
  },
  stars: ({ ctx, x, y, size }) => {
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
  }
};
