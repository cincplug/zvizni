import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Visualizer3d = ({ analyser, canvasRef, rendererRef }) => {
  const [w] = useState(window.innerWidth);
  const [h] = useState(window.innerHeight);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.TorusKnotGeometry(1, 2, 6, 70);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00aaff,
      shininess: 70,
      specular: 0xffffff
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, canvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      requestAnimationFrame(animate);

      analyser.getByteFrequencyData(dataArray);

      const averageAmplitude =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

      const vertices = torus.geometry.attributes.position.array;
      for (let i = 0; i < vertices.length; i += 1) {
        const offset = dataArray[i % bufferLength];
        vertices[i] += Math.min(
          200,
          offset * (averageAmplitude / vertices.length)
        );
      }
      torus.geometry.attributes.position.needsUpdate = true;

      const colorValue = averageAmplitude / 255;
      torus.material.color.setHSL(colorValue, 1, 0.5);

      controls.update();
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
