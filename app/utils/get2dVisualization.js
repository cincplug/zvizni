export const get2dVisualization = {
  zezni: ({ ctx, i, totalPoints, size, x, y, prevX, prevY, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const pointX = x + size * Math.cos(angle);
    const pointY = y + size * Math.sin(angle);

    const avgX = (prevX + pointX) / 2;
    const avgY = (prevY + pointY) / 2;

    ctx.lineTo(avgX, avgY);
  },
  mazni: ({ ctx, i, totalPoints, size, x, y, width, height, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = y / x;
    const pointX = x + (size - i * sizeIncrement) * Math.cos(angle) - width / 2;
    const pointY = y - ((size + i / sizeIncrement) * Math.sin(angle)) / 3;

    ctx.lineTo(pointX, pointY);
  },
  lezni: ({ ctx, i, totalPoints, size, x, y, width, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = y / x;
    const pointX = x + ((size - i * sizeIncrement) % x);
    const pointY = y - ((size + i / sizeIncrement) * Math.sin(angle)) / 3;

    ctx.lineTo(pointX, pointY);
  },
  smazni: ({ ctx, i, totalPoints, size, x, y, width, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const sizeIncrement = width % x;
    const pointX = x / (size - i * sizeIncrement) + x;
    const pointY = y - ((size + i / sizeIncrement) * Math.sin(angle)) / 2;

    ctx.lineTo(pointX, pointY);
  }
};
