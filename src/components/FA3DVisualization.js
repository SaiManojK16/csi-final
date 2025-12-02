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
    scene.background = new THREE.Color(0xfff7f0);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffd166, 0.9);
    directionalLight1.position.set(5, 8, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x2ec4b6, 0.6);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xff8a65, 0.5, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Define FA: 2-state DFA for strings ending with "0"
    const states = [
      { 
        id: 'q0', 
        position: new THREE.Vector3(-2, 0, 0), 
        isStart: true, 
        isAccept: false 
      },
      { 
        id: 'q1', 
        position: new THREE.Vector3(2, 0, 0), 
        isStart: false, 
        isAccept: true 
      }
    ];

    const transitions = [
      { from: 'q0', to: 'q1', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' },
      { from: 'q1', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q0', symbol: '1' }
    ];

    // Create state meshes
    const stateMeshes = new Map();
    const stateGroup = new THREE.Group();

    states.forEach(stateData => {
      const stateColor = stateData.isAccept ? 0xff8a65 : 0x667eea;
      const emissiveColor = stateData.isAccept ? 0xff8a65 : 0x667eea;

      // Outer circle for accepting state
      if (stateData.isAccept) {
        const outerGeometry = new THREE.TorusGeometry(1.3, 0.1, 16, 32);
        const outerMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xff8a65,
          emissive: 0xff8a65,
          emissiveIntensity: 0.3,
          shininess: 80
        });
        const outerTorus = new THREE.Mesh(outerGeometry, outerMaterial);
        outerTorus.rotation.x = Math.PI / 2;
        outerTorus.position.copy(stateData.position);
        stateGroup.add(outerTorus);
      }

      // Main state sphere with gradient effect
      const geometry = new THREE.SphereGeometry(1.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: stateColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.2,
        shininess: 120,
        specular: 0xffffff
      });
      const stateMesh = new THREE.Mesh(geometry, material);
      stateMesh.position.copy(stateData.position);
      stateGroup.add(stateMesh);

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: emissiveColor,
        transparent: true,
        opacity: 0.2
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(stateData.position);
      stateGroup.add(glowMesh);

      // State label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      context.fillStyle = '#ffffff';
      context.font = 'Bold 140px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(stateData.id === 'q0' ? 'q₀' : 'q₁', 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1.8, 1.8, 1);
      sprite.position.copy(stateData.position);
      sprite.position.y += 1.6;
      stateGroup.add(sprite);

      stateMeshes.set(stateData.id, { mesh: stateMesh, group: stateGroup });
    });

    scene.add(stateGroup);

    // Create transitions
    const transitionGroup = new THREE.Group();
    
    transitions.forEach((transitionData, index) => {
      const fromState = stateMeshes.get(transitionData.from);
      const toState = stateMeshes.get(transitionData.to);
      if (!fromState || !toState) return;

      const fromPos = states.find(s => s.id === transitionData.from).position;
      const toPos = states.find(s => s.id === transitionData.to).position;
      const isSelfLoop = transitionData.from === transitionData.to;

      if (isSelfLoop) {
        // Self-loop: curved path
        const height = index % 2 === 0 ? 1.8 : -1.8;
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(fromPos.x + 1.3, fromPos.y, fromPos.z),
          new THREE.Vector3(fromPos.x, fromPos.y + height, fromPos.z),
          new THREE.Vector3(fromPos.x - 1.3, fromPos.y, fromPos.z)
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
          color: 0x475569,
          linewidth: 4
        });
        const curveLine = new THREE.Line(geometry, material);
        transitionGroup.add(curveLine);

        // Arrow for self-loop
        const arrowDirection = new THREE.Vector3(-1, 0, 0).normalize();
        const arrowHelper = new THREE.ArrowHelper(
          arrowDirection,
          new THREE.Vector3(fromPos.x - 1.3, fromPos.y, fromPos.z),
          0.6,
          0x475569,
          0.4,
          0.25
        );
        transitionGroup.add(arrowHelper);

        // Symbol label for self-loop
        const symbolCanvas = document.createElement('canvas');
        const symbolContext = symbolCanvas.getContext('2d');
        symbolCanvas.width = 128;
        symbolCanvas.height = 128;
        symbolContext.fillStyle = '#1f2a44';
        symbolContext.font = 'Bold 90px Arial';
        symbolContext.textAlign = 'center';
        symbolContext.textBaseline = 'middle';
        symbolContext.fillText(transitionData.symbol, 64, 64);
        
        const symbolTexture = new THREE.CanvasTexture(symbolCanvas);
        const symbolSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: symbolTexture }));
        symbolSprite.scale.set(0.9, 0.9, 1);
        symbolSprite.position.set(fromPos.x, fromPos.y + height + 0.3, fromPos.z);
        transitionGroup.add(symbolSprite);
      } else {
        // Normal transition: straight line with arrow
        const direction = new THREE.Vector3().subVectors(toPos, fromPos).normalize();
        const startPoint = new THREE.Vector3().copy(fromPos).add(direction.multiplyScalar(1.1));
        const endPoint = new THREE.Vector3().copy(toPos).sub(direction.multiplyScalar(1.1));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0x475569,
          linewidth: 4
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        transitionGroup.add(line);

        // Arrow
        const arrowHelper = new THREE.ArrowHelper(
          direction,
          endPoint,
          0.6,
          0x475569,
          0.4,
          0.25
        );
        transitionGroup.add(arrowHelper);

        // Symbol label
        const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
        const symbolCanvas = document.createElement('canvas');
        const symbolContext = symbolCanvas.getContext('2d');
        symbolCanvas.width = 128;
        symbolCanvas.height = 128;
        symbolContext.fillStyle = '#1f2a44';
        symbolContext.font = 'Bold 90px Arial';
        symbolContext.textAlign = 'center';
        symbolContext.textBaseline = 'middle';
        symbolContext.fillText(transitionData.symbol, 64, 64);
        
        const symbolTexture = new THREE.CanvasTexture(symbolCanvas);
        const symbolSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: symbolTexture }));
        symbolSprite.scale.set(0.9, 0.9, 1);
        symbolSprite.position.copy(midPoint);
        symbolSprite.position.y += 0.5;
        transitionGroup.add(symbolSprite);
      }
    });

    scene.add(transitionGroup);

    // Start arrow indicator
    const startArrowGroup = new THREE.Group();
    const q0Pos = states.find(s => s.id === 'q0').position;
    const startArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0).normalize(),
      new THREE.Vector3(q0Pos.x - 2.5, q0Pos.y, q0Pos.z),
      1.8,
      0x667eea,
      0.5,
      0.35
    );
    startArrowGroup.add(startArrow);
    scene.add(startArrowGroup);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate the entire scene slowly for visual appeal
      stateGroup.rotation.y += 0.003;
      transitionGroup.rotation.y += 0.003;
      
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

