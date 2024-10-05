export const visualizations = {
  flower: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y) => {
        ctx.lineTo(x, y);
      },
      ctx,
      hue,
      settings
    );
  },
  squares: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y, size) => {
        ctx.rect(x - size / 2, y - size / 2, size, size);
      },
      ctx,
      hue,
      settings
    );
  },
  triangles: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y, size) => {
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
      },
      ctx,
      hue,
      settings
    );
  },
  circles: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y, size) => {
        ctx.moveTo(x + size / 2, y);
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      },
      ctx,
      hue,
      settings
    );
  },
  hexagons: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y, size) => {
        const side = size / 2;
        ctx.moveTo(x + side * Math.cos(0), y + side * Math.sin(0));
        for (let i = 1; i <= 6; i++) {
          ctx.lineTo(
            x + side * Math.cos((i * 2 * Math.PI) / 6),
            y + side * Math.sin((i * 2 * Math.PI) / 6)
          );
        }
      },
      ctx,
      hue,
      settings
    );
  },
  stars: (ctx, drawShape, hue, settings) => {
    drawShape(
      (x, y, size) => {
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
      },
      ctx,
      hue,
      settings
    );
  }
};
