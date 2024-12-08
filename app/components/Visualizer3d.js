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
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;

    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      shininess: 150,
      specular: new THREE.Color(0xffffff)
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.001;
      cube.rotation.y += 0.001;
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
