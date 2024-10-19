export const loopTypes = {
  none: ({ mousePos }) => ({
    x: mousePos.x,
    y: mousePos.y
  }),
  x: ({ frame, mousePos }) => ({
    x: frame,
    y: mousePos.y
  }),
  y: ({ frame, mousePos }) => ({
    x: mousePos.x,
    y: frame
  }),
  spiral: ({ frame, mousePos }) => {
    const spiralRadius = 0.1 * mousePos.x;
    const angle = 0.1 * frame;

    return {
      x: mousePos.x + spiralRadius * Math.cos(angle),
      y: mousePos.y + spiralRadius * Math.sin(angle)
    };
  }
};
