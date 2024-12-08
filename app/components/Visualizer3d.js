import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Visualizer2d from "./Visualizer2d";

const Visualizer3d = ({ analyser, settings, loopedSetting }) => {
  const canvasRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const [w] = useState(window.innerWidth);
  const [h] = useState(window.innerHeight);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = w;
      canvas.height = h;
      setIsCanvasReady(true);
    }
  }, [w, h]);

  useEffect(() => {
    if (!isCanvasReady) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(w, h);
    const currentThreeCanvasRef = threeCanvasRef.current;
    currentThreeCanvasRef.appendChild(renderer.domElement);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const geometry = new THREE.BoxGeometry(5, 5, 5); // Use BoxGeometry for the cube
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 10;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      texture.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      currentThreeCanvasRef.removeChild(renderer.domElement);
    };
  }, [isCanvasReady, w, h]);

  return (
    <>
      <Visualizer2d
        analyser={analyser}
        settings={settings}
        loopedSetting={loopedSetting}
        canvasRef={canvasRef}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        ref={threeCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      ></div>
    </>
  );
};

export default Visualizer3d;
