import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const FA3DVisualization = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Define FA: Single state accepting all strings
    const states = [
      { 
        id: 'q0', 
        position: new THREE.Vector3(0, 0, 0), 
        isStart: true, 
        isAccept: true 
      }
    ];

    const transitions = [
      { from: 'q0', to: 'q0', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' }
    ];

    // Create state meshes
    const stateMeshes = new Map();
    const stateGroup = new THREE.Group();

    states.forEach(stateData => {
      // Outer circle for accepting state
      if (stateData.isAccept) {
        const outerGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 32);
        const outerMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x2ec4b6,
          emissive: 0x2ec4b6,
          emissiveIntensity: 0.2
        });
        const outerTorus = new THREE.Mesh(outerGeometry, outerMaterial);
        outerTorus.rotation.x = Math.PI / 2;
        stateGroup.add(outerTorus);
      }

      // Main state sphere
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x2ec4b6,
        emissive: 0x2ec4b6,
        emissiveIntensity: 0.1,
        shininess: 100
      });
      const stateMesh = new THREE.Mesh(geometry, material);
      stateMesh.position.copy(stateData.position);
      stateGroup.add(stateMesh);

      // State label (using sprite for text)
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      context.fillStyle = '#ffffff';
      context.font = 'Bold 120px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('q₀', 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1.5, 1.5, 1);
      sprite.position.copy(stateData.position);
      sprite.position.y += 1.5;
      stateGroup.add(sprite);

      stateMeshes.set(stateData.id, { mesh: stateMesh, group: stateGroup });
    });

    scene.add(stateGroup);

    // Create transitions (self-loops)
    const transitionGroup = new THREE.Group();
    
    transitions.forEach((transitionData, index) => {
      const stateMesh = stateMeshes.get(transitionData.from);
      if (!stateMesh) return;

      // Create curved self-loop
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(1.2, 0, 0),
        new THREE.Vector3(0, index === 0 ? 2 : -2, 0),
        new THREE.Vector3(-1.2, 0, 0)
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x1f2a44,
        linewidth: 3
      });
      const curveLine = new THREE.Line(geometry, material);
      transitionGroup.add(curveLine);

      // Add arrow at the end
      const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(-1, 0, 0).normalize(),
        new THREE.Vector3(-1.2, 0, 0),
        0.5,
        0x1f2a44,
        0.3,
        0.2
      );
      transitionGroup.add(arrowHelper);

      // Add symbol label
      const symbolCanvas = document.createElement('canvas');
      const symbolContext = symbolCanvas.getContext('2d');
      symbolCanvas.width = 128;
      symbolCanvas.height = 128;
      symbolContext.fillStyle = '#1f2a44';
      symbolContext.font = 'Bold 80px Arial';
      symbolContext.textAlign = 'center';
      symbolContext.textBaseline = 'middle';
      symbolContext.fillText(transitionData.symbol, 64, 64);
      
      const symbolTexture = new THREE.CanvasTexture(symbolCanvas);
      const symbolSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: symbolTexture }));
      symbolSprite.scale.set(0.8, 0.8, 1);
      symbolSprite.position.set(0, index === 0 ? 2.5 : -2.5, 0);
      transitionGroup.add(symbolSprite);
    });

    scene.add(transitionGroup);

    // Start arrow indicator
    const startArrowGroup = new THREE.Group();
    const startArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0).normalize(),
      new THREE.Vector3(-3, 0, 0),
      1.5,
      0x2ec4b6,
      0.4,
      0.3
    );
    startArrowGroup.add(startArrow);
    scene.add(startArrowGroup);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate the state group slowly
      stateGroup.rotation.y += 0.005;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }} 
    />
  );
};

export default FA3DVisualization;

