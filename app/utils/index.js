export const clearCanvas = () => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

export const saveCanvas = () => {
  let canvas;

  if (visualizationType === "2d") {
    canvas = canvasRef.current;
  } else if (visualizationType === "3d") {
    const renderer = rendererRef.current;
    if (renderer) {
      const { renderer: threeRenderer, scene, camera } = renderer;
      threeRenderer.render(scene, camera); // Explicitly render the current scene
      canvas = threeRenderer.domElement;
    }
  }

  if (canvas) {
    const link = document.createElement("a");
    link.download = "visualization.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
};
