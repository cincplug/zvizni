import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const targetFrameRate = 1000 / 60;

const Visualizer3d = ({ analyser }) => {
  const threeRenderer = useRef(null);
  const threeScene = useRef(null);
  const threeCamera = useRef(null);
  const containerRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);

    threeRenderer.current = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      alpha: true
    });

    threeRenderer.current.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.current.setClearColor(0x000000, 0);

    threeScene.current = new THREE.Scene();

    const cameraDistance = window.innerHeight / 2 + 10;
    threeCamera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    threeCamera.current.position.z = cameraDistance;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    threeScene.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 100, 200).normalize();
    threeScene.current.add(directionalLight);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6,
    });

    const createCube = (x, y, size) => {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const cube = new THREE.Mesh(geometry, material);

      cube.position.set(x, y, 0);
      threeScene.current.add(cube);
    };

    const stageGeometry = new THREE.BoxGeometry(
      window.innerWidth,
      window.innerHeight,
      100
    );
    const stageMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.z = -10;
    threeScene.current.add(stage);

    createCube(0, 0, 20);

    const animate = (time) => {
      const deltaTime = time - lastTimeRef.current;
      if (deltaTime < targetFrameRate) {
        requestAnimationFrame(animate);
        return;
      }

      lastTimeRef.current = time;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const scale = (averageAmplitude / 255) * 10 + 5;

      threeRenderer.current.render(threeScene.current, threeCamera.current);
      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 200 - 100;
      const y = -(event.clientY / window.innerHeight) * 200 + 100;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const scale = averageAmplitude;

      createCube(x * 5, y * 5, scale * 10);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -(touch.clientY / window.innerHeight) * 2 + 1;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const scale = (averageAmplitude / 255) * 10 + 5;

      createCube(x * 10, y * 10, scale);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.remove();
      if (threeRenderer.current) threeRenderer.current.dispose();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [analyser]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full"
    ></div>
  );
};

export default Visualizer3d;
