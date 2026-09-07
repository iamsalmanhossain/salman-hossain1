'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface PixelSnowProps {
  color?: string;
  flakeSize?: number;
  minFlakeSize?: number;
  pixelResolution?: number;
  speed?: number;
  density?: number;
  direction?: number;
  brightness?: number;
  depthFade?: number;
  farPlane?: number;
  gamma?: number;
  variant?: 'square' | 'circle';
}

export default function PixelSnow({
  color = '#ffffff',
  flakeSize = 0.05,
  minFlakeSize = 0.01,
  speed = 1.0,
  density = 0.3,
  direction = 0,
  farPlane = 20,
}: PixelSnowProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Clear any existing canvases (fixes HMR frozen canvas bug)
    while (currentMount.firstChild) {
      currentMount.removeChild(currentMount.firstChild);
    }

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); // Black background for space/snow
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, farPlane);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Create particles
    const particleCount = Math.floor(2000 * density);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random positions - spread them out much wider to cover full screen
      positions[i * 3] = (Math.random() - 0.5) * 80; // x (-40 to 40)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80; // y (-40 to 40)
      positions[i * 3 + 2] = -Math.random() * farPlane; // z (0 to -farPlane)

      // Velocity based on speed and direction
      velocities[i * 3] = (Math.random() - 0.5) * 0.02 + Math.sin(direction) * 0.01; // vx
      velocities[i * 3 + 1] = -(Math.random() * 0.02 + 0.02) * speed; // vy (falling down)
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // vz
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Calculate a reasonable size from props
    const renderSize = Math.max(flakeSize, minFlakeSize) * 0.1;

    // Simple point material
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: renderSize > 0 ? renderSize : 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Update positions
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset particle if it goes out of bounds (infinite loop wrap-around)
        if (positions[i * 3 + 1] < -40) {
          positions[i * 3 + 1] = 40; // wrap Y
        }
        
        if (positions[i * 3] < -40) {
          positions[i * 3] = 40; // wrap X
        } else if (positions[i * 3] > 40) {
          positions[i * 3] = -40; // wrap X
        }

        if (positions[i * 3 + 2] < -farPlane) {
          positions[i * 3 + 2] = 0; // wrap Z
        } else if (positions[i * 3 + 2] > 0) {
          positions[i * 3 + 2] = -farPlane; // wrap Z
        }
      }

      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.02 * delta; // slight rotation for a 3D feel

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, flakeSize, minFlakeSize, speed, density, direction, farPlane]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
