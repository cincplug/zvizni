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
  },

  grizni: ({ ctx, i, size, x, y, width, height, prevX, prevY }) => {
    ctx.moveTo(prevX, prevY);
    ctx.arc(x, y, size / i, i, Math.PI * 2);
  },

  zagrizni: ({ ctx, i, size, x, y, width, height, prevX, prevY }) => {
    ctx.moveTo(prevX, prevY);
    const clampedY = Math.min(
      Math.max(Math.cos(y) * size + height / 2, size),
      height - size
    );
    const radius = Math.min(50, size / (i + 1));
    ctx.arc(x, clampedY, radius, 0, Math.PI * 2);
  }
};
