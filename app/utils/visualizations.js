export const visualizations = {
  flowers: ({ ctx, i, totalPoints, size, x, y, prevX, prevY, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const pointX = x + size * Math.cos(angle);
    const pointY = y + size * Math.sin(angle);

    const avgX = (prevX + pointX) / 2;
    const avgY = (prevY + pointY) / 2;

    ctx.lineTo(avgX, avgY);
  },
  something: ({ ctx, i, totalPoints, size, x, y, prevX, prevY, settings }) => {
    const angle = (i / totalPoints) * settings.angleRange;

    const pointX = x + size * Math.cos(angle);
    const pointY = y + size * Math.sin(angle);

    const avgX = (prevX + pointX) / 2;
    const avgY = (prevY + pointY) / 2;

    ctx.quadraticCurveTo(avgX, avgY, prevX, prevY);
  }
};
