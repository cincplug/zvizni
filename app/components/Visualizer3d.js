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

const createSphere = (settings, position = { x: 0, y: 0, z: 0 }) => {
  const {
    color,
    shininess,
    specular,
    sphereRadius,
    sphereWidthSegments,
    sphereHeightSegments
  } = settings;
  const geometry = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthSegments,
    sphereHeightSegments
  );
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    shininess,
    specular: new THREE.Color(specular)
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);
  return sphere;
};

const updateVertices = (
  vertices,
  dataArray,
  dominantFrequency,
  vertDispLimit,
  averageAmplitude,
  vertexChangeLimit
) => {
  for (let i = 0; i < vertices.length; i += 3) {
    const offset = dataArray[i % dataArray.length];
    if (!isNaN(vertices[i])) {
      const directionX = Math.sin(dominantFrequency * Math.PI * 2 + i);
      const directionY = Math.cos(dominantFrequency * Math.PI * 2 + i);
      const directionZ = Math.sin(dominantFrequency * Math.PI * 2 - i);

      const length = Math.sqrt(
        vertices[i] ** 2 + vertices[i + 1] ** 2 + vertices[i + 2] ** 2
      );
      if (length > vertexChangeLimit) {
        vertices[i] +=
          directionX *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          ) *
          Math.cos(Math.PI / 4);
        vertices[i + 1] +=
          directionY *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          ) *
          Math.cos(Math.PI / 4);
        vertices[i + 2] +=
          directionZ *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          ) *
          Math.cos(Math.PI / 4);
      } else {
        vertices[i] +=
          directionX *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          );
        vertices[i + 1] +=
          directionY *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          );
        vertices[i + 2] +=
          directionZ *
          Math.min(
            vertDispLimit,
            offset * (averageAmplitude / vertices.length)
          );
      }
    }
  }
};

const Visualizer3d = ({ analyser, settings, canvasRef, rendererRef }) => {
  const [w] = useState(window.innerWidth);
  const [h] = useState(window.innerHeight);
  const settingsRef = useRef(settings);
  const spheresRef = useRef([]);
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

    const initialSphere = createSphere(settingsRef.current);
    scene.add(initialSphere);
    spheresRef.current.push(initialSphere);

    const controls = new OrbitControls(camera, canvas);
    controlsRef.current = controls;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      requestAnimationFrame(animate);

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const dominantFrequencyIndex = dataArray.indexOf(Math.max(...dataArray));
      const dominantFrequency = dominantFrequencyIndex / bufferLength;

      let currentSphere = spheresRef.current[spheresRef.current.length - 1];
      updateVertices(
        currentSphere.geometry.attributes.position.array,
        dataArray,
        dominantFrequency,
        settingsRef.current.vertDispLimit,
        averageAmplitude,
        settingsRef.current.vertexChangeLimit
      );
      currentSphere.geometry.attributes.position.needsUpdate = true;

      vertexCountRef.current +=
        currentSphere.geometry.attributes.position.array.length / 3;
      if (vertexCountRef.current >= settingsRef.current.maxVertices) {
        vertexCountRef.current = 0;
        const newPosition = {
          x: currentSphere.position.x + settingsRef.current.spacing,
          y: currentSphere.position.y,
          z: currentSphere.position.z
        };
        const newSphere = createSphere(settingsRef.current, newPosition);
        scene.add(newSphere);
        spheresRef.current.push(newSphere);

        // Set the target position and lookAt for the camera
        targetPositionRef.current.set(
          newPosition.x,
          camera.position.y,
          camera.position.z
        );
        targetLookAtRef.current.set(newPosition.x, 0, 0);
      }

      // Linearly interpolate the camera position and lookAt
      const delta = 0.05; // Adjust this value to control the speed of the transition
      camera.position.lerp(targetPositionRef.current, delta);
      controls.target.lerp(targetLookAtRef.current, delta);
      controls.update();

      currentSphere.material.color.set(settingsRef.current.color);

      renderer.render(scene, camera);
    };

    animate();

    rendererRef.current = { renderer, scene, camera };

    return () => {
      renderer.dispose();
    };
  }, [analyser, w, h, canvasRef, rendererRef]);

  return null;
};

export default Visualizer3d;
