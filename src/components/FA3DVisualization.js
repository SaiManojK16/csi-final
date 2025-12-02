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

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4ecdc4, 0.7);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const pointLight1 = new THREE.PointLight(0xff6b6b, 0.8, 50);
    pointLight1.position.set(0, 0, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.6, 50);
    pointLight2.position.set(-3, -3, 5);
    scene.add(pointLight2);

    // Define FA: 2-state DFA for strings ending with "0"
    // Arrange in a more interesting 3D layout
    const states = [
      { 
        id: 'q0', 
        position: new THREE.Vector3(-2.5, 1, 0), 
        isStart: true, 
        isAccept: false 
      },
      { 
        id: 'q1', 
        position: new THREE.Vector3(2.5, -1, 0), 
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

    // Create state meshes with unique geometric shapes
    const stateMeshes = new Map();
    const stateGroup = new THREE.Group();

    states.forEach(stateData => {
      const stateColor = stateData.isAccept ? 0xff6b6b : 0x4ecdc4;
      const emissiveColor = stateData.isAccept ? 0xff6b6b : 0x4ecdc4;

      // Use octahedron for more interesting shape
      const geometry = new THREE.OctahedronGeometry(1.2, 0);
      const material = new THREE.MeshPhongMaterial({ 
        color: stateColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.3,
        shininess: 150,
        specular: 0xffffff,
        flatShading: false
      });
      const stateMesh = new THREE.Mesh(geometry, material);
      stateMesh.position.copy(stateData.position);
      stateGroup.add(stateMesh);

      // Add rotating ring around state
      const ringGeometry = new THREE.TorusGeometry(1.5, 0.06, 8, 32);
      const ringMaterial = new THREE.MeshPhongMaterial({ 
        color: emissiveColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(stateData.position);
      stateGroup.add(ring);

      // Outer torus for accepting state
      if (stateData.isAccept) {
        const outerTorusGeometry = new THREE.TorusGeometry(1.7, 0.08, 8, 32);
        const outerTorusMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xff6b6b,
          emissive: 0xff6b6b,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.6
        });
        const outerTorus = new THREE.Mesh(outerTorusGeometry, outerTorusMaterial);
        outerTorus.rotation.x = Math.PI / 2;
        outerTorus.position.copy(stateData.position);
        stateGroup.add(outerTorus);
      }

      // Add particle effect around state
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 20;
      const positions = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount * 3; i += 3) {
        const radius = 1.8;
        const theta = (i / 3) * (Math.PI * 2 / particlesCount);
        positions[i] = Math.cos(theta) * radius;
        positions[i + 1] = Math.sin(theta) * radius;
        positions[i + 2] = (Math.random() - 0.5) * 0.5;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        color: emissiveColor,
        size: 0.15,
        transparent: true,
        opacity: 0.6
      });
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      particles.position.copy(stateData.position);
      stateGroup.add(particles);

      // State label with better styling
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 512;
      context.fillStyle = '#ffffff';
      context.strokeStyle = '#1f2a44';
      context.lineWidth = 8;
      context.font = 'Bold 200px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.strokeText(stateData.id === 'q0' ? 'q₀' : 'q₁', 256, 256);
      context.fillText(stateData.id === 'q0' ? 'q₀' : 'q₁', 256, 256);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(2, 2, 1);
      sprite.position.copy(stateData.position);
      sprite.position.y += 2;
      stateGroup.add(sprite);

      stateMeshes.set(stateData.id, { 
        mesh: stateMesh, 
        ring: ring,
        particles: particles,
        group: stateGroup 
      });
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
      
      // Animate states with rotation and floating effect
      states.forEach((stateData, index) => {
        const stateObj = stateMeshes.get(stateData.id);
        if (stateObj) {
          // Rotate the octahedron
          stateObj.mesh.rotation.x += 0.01;
          stateObj.mesh.rotation.y += 0.015;
          
          // Rotate the ring
          if (stateObj.ring) {
            stateObj.ring.rotation.z += 0.02;
          }
          
          // Floating animation
          const time = Date.now() * 0.001;
          stateObj.mesh.position.y = stateData.position.y + Math.sin(time + index) * 0.2;
          
          // Rotate particles
          if (stateObj.particles) {
            stateObj.particles.rotation.y += 0.01;
          }
        }
      });
      
      // Rotate transition group slowly
      transitionGroup.rotation.y += 0.002;
      
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

