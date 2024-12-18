const createLineTo = (ctx, width, height) => {
  return (pointX, pointY) => {
    const x = Math.min(width, Math.max(0, pointX));
    const y = Math.min(height, Math.max(0, pointY));
    ctx.lineTo(x, y);
  };
};

export const get2dVisualization = {
  zezni: ({
    ctx,
    i,
    totalPoints,
    size,
    x,
    y,
    width,
    height,
    prevX,
    prevY,
    settings
  }) => {
    const lineTo = createLineTo(ctx, width, height);
    const angle = (i / totalPoints) * settings.angleRange;

    const pointX = x + size * Math.cos(angle);
    const pointY = y + size * Math.sin(angle);

    const avgX = (prevX + pointX) / 2;
    const avgY = (prevY + pointY) / 2;

    lineTo(pointX, pointY);
  },
  mazni: ({ ctx, i, totalPoints, size, x, y, width, height, settings }) => {
    const lineTo = createLineTo(ctx, width, height);
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = y / x;
    const pointX = x + (size - i * sizeIncrement) * Math.cos(angle) - width / 2;
    const pointY = y - ((size + i / sizeIncrement) * Math.sin(angle)) / 3;

    lineTo(pointX, pointY);
  },
  lezni: ({ ctx, i, totalPoints, size, x, y, width, height, settings }) => {
    const lineTo = createLineTo(ctx, width, height);
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = y / x;
    const pointX = x + ((size - i * sizeIncrement) % x);
    const pointY = y - ((size + i / sizeIncrement) * Math.sin(angle)) / 3;

    lineTo(pointX, pointY);
  },
  smazni: ({ ctx, i, totalPoints, size, x, y, width, height, settings }) => {
    const lineTo = createLineTo(ctx, width, height);
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = width % x;
    const pointX = x / (size - i * sizeIncrement) + x;
    const pointY = y - (size + i / sizeIncrement) * Math.sin(angle);

    lineTo(pointX, pointY);
  }
};
