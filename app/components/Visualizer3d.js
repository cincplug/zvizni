import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const createRenderer = (canvas, width, height) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  return renderer;
};

const createCamera = (width, height) => {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 20, 30);
  camera.lookAt(0, 0, 0);
  return camera;
};

const createLights = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
};

const createCylinder = (settings, radius, position = { x: 0, y: 0, z: 0 }) => {
  const { color } = settings;
  const geometry = new THREE.CylinderGeometry(radius, radius, 10, 20);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true
  });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(position.x, position.y, position.z);
  cylinder.rotation.z = Math.PI / 2;
  return cylinder;
};

const updateVertices = (
  vertices,
  dataArray,
  dominantFrequency,
  vertDispLimit,
  averageAmplitude
) => {
  for (let i = 0; i < vertices.length; i += 3) {
    const offset = dataArray[i % dataArray.length];
    if (!isNaN(vertices[i])) {
      const directionX = Math.sin(dominantFrequency * Math.PI * 2 + i);
      const directionY = Math.cos(dominantFrequency * Math.PI * 2 + i);
      const directionZ = Math.sin(dominantFrequency * Math.PI * 2 - i);

      const length = Math.sqrt(
        vertices[i] ** 2 + vertices[i + 1] ** 2 + vertices[i + 2] * 2
      );
      vertices[i] +=
        directionX *
        Math.min(vertDispLimit, offset * (averageAmplitude / vertices.length)) *
        Math.cos(Math.PI / 4);
      vertices[i + 1] +=
        directionY *
        Math.min(vertDispLimit, offset * (averageAmplitude / vertices.length)) *
        Math.cos(Math.PI / 4);
      vertices[i + 2] +=
        directionZ *
        Math.min(vertDispLimit, offset * (averageAmplitude / vertices.length)) *
        Math.cos(Math.PI / 4);
    }
  }
};

const Visualizer3d = ({
  analyser,
  settings,
  canvasRef,
  rendererRef,
  loopedSetting
}) => {
  const [w] = useState(window.innerWidth);
  const [h] = useState(window.innerHeight);
  const settingsRef = useRef(settings);
  const cylindersRef = useRef([]);
  const vertexCountRef = useRef(0);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const targetPositionRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = createRenderer(canvas, w, h);
    const scene = new THREE.Scene();
    const camera = createCamera(w, h);
    cameraRef.current = camera;

    createLights(scene);

    const initialCylinder = createCylinder(settingsRef.current);
    scene.add(initialCylinder);
    cylindersRef.current.push(initialCylinder);

    const controls = new OrbitControls(camera, canvas);
    controlsRef.current = controls;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let lastFrameTime = 0;
    let lastCylinderAddTime = 0;
    const targetFrameTime = 1000 / 60;

    const animate = (time) => {
      requestAnimationFrame(animate);
      const { addingInterval, loopType } = settingsRef.current;

      if (loopedSetting && settingsRef.current[loopType] < loopedSetting.max) {
        settingsRef.current[loopType] += loopedSetting.step;
      } else if (loopedSetting) {
        settingsRef.current[loopType] = loopedSetting.min;
      }

      const deltaTime = time - lastFrameTime;
      if (deltaTime < targetFrameTime) return;
      lastFrameTime = time;

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const dominantFrequencyIndex = dataArray.indexOf(Math.max(...dataArray));
      const dominantFrequency = dominantFrequencyIndex / bufferLength;

      let currentCylinder =
        cylindersRef.current[cylindersRef.current.length - 1];
      updateVertices(
        currentCylinder.geometry.attributes.position.array,
        dataArray,
        dominantFrequency,
        settingsRef.current.vertDispLimit,
        averageAmplitude,
        settingsRef.current.vertexChangeLimit
      );
      currentCylinder.geometry.attributes.position.needsUpdate = true;

      vertexCountRef.current +=
        currentCylinder.geometry.attributes.position.array.length / 3;
      if (time - lastCylinderAddTime >= addingInterval) {
        lastCylinderAddTime = time;
        vertexCountRef.current = 0;
        const newPosition = {
          x: currentCylinder.position.x + settingsRef.current.radius,
          y: currentCylinder.position.y,
          z: currentCylinder.position.z
        };
        const radius = averageAmplitude;
        const newCylinder = createCylinder(
          settingsRef.current,
          radius,
          newPosition
        );
        scene.add(newCylinder);
        cylindersRef.current.push(newCylinder);

        targetPositionRef.current.set(
          newPosition.x,
          camera.position.y,
          camera.position.z
        );
        targetLookAtRef.current.set(newPosition.x, 0, 0);
      }

      const delta = 0.05;
      camera.position.lerp(targetPositionRef.current, delta);
      controls.target.lerp(targetLookAtRef.current, delta);
      controls.update();

      currentCylinder.material.color.set(settingsRef.current.color);

      renderer.render(scene, camera);
    };

    animate();

    rendererRef.current = { renderer, scene, camera };

    return () => {
      renderer.dispose();
    };
  }, [analyser, w, h, canvasRef, rendererRef, loopedSetting]);

  return null;
};

export default Visualizer3d;
