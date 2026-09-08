"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const TechSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // ১. সিন, ক্যামেরা ও রেন্ডারার সেটআপ
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      1,
      1000
    );
    camera.position.z = 26;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // ২. কন্ট্রোল সেটআপ (মাউস দিয়ে ঘোরানোর জন্য)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true; // অটো রোটেশন চালু
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = false; // জুম বন্ধ রাখতে চাইলে false দিন

    // ৩. মাঝখানের Wireframe Sphere (জালিকা কাঠামো)
    const sphereRadius = 8.5;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 2);
    
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x8b4513,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeSphere = new THREE.Mesh(sphereGeo, wireframeMat);
    scene.add(wireframeSphere);

    // ভেতরের আবছা গ্লো ইফেক্ট
    const innerCoreGeo = new THREE.SphereGeometry(sphereRadius * 0.98, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x2b1d14,
      transparent: true,
      opacity: 0.25,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    scene.add(innerCore);

    // ৪. টেকনোলজি আইটেম তালিকা
    const techItems = [
      { name: "K8s", symbol: "☸", color: "#326ce5" },
      { name: "Terraform", symbol: "⬡", color: "#844fba" },
      { name: "Kotlin", symbol: "◆", color: "#a97bff" },
      { name: "MySQL", symbol: "🐬", color: "#00758f" },
      { name: "Firebase", symbol: "🔥", color: "#ffca28" },
      { name: "Linux", symbol: "🐧", color: "#ffffff" },
      { name: "GCP", symbol: "☁", color: "#4285f4" },
      { name: "Android", symbol: "🤖", color: "#78c257" },
      { name: "Bash", symbol: ">_", color: "#4eaa25" },
      { name: "Azure", symbol: "▲", color: "#0089d6" },
      { name: "GraphQL", symbol: "⬢", color: "#e535ab" },
      { name: "Figma", symbol: "❖", color: "#f24e1e" },
      { name: "Rust", symbol: "⚙", color: "#dea584" },
      { name: "C++", symbol: "C++", color: "#00599c" },
      { name: "Three.js", symbol: "▲", color: "#049ef4" },
      { name: "Prisma", symbol: "◭", color: "#2d3748" },
    ];

    // ক্যানভাসে আইকন + টেক্সট ড্র করে স্প্রাইট তৈরি করার ফাংশন
    const createIconSprite = (item: { name: string; symbol: string; color: string }) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = item.color;
        ctx.font = "bold 85px sans-serif";
        ctx.fillText(item.symbol, 128, 100);

        ctx.fillStyle = "#cfd8dc";
        ctx.font = "bold 26px monospace";
        ctx.fillText(item.name, 128, 185);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.2, 3.2, 1);
      return sprite;
    };

    // ৫. স্ফিয়ারের চারপাশে সমদূরত্বে বসানো (Fibonacci Sphere)
    const totalItems = techItems.length;
    const phi = Math.PI * (3 - Math.sqrt(5));

    techItems.forEach((tech, i) => {
      const y = 1 - (i / (totalItems - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const sprite = createIconSprite(tech);
      const iconRadius = sphereRadius * 1.08;
      sprite.position.set(x * iconRadius, y * iconRadius, z * iconRadius);
      
      wireframeSphere.add(sprite);
    });

    // ৬. রেসপন্সিভ হ্যান্ডলার
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // ৭. অ্যানিমেশন লুপ
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ৮. ক্লিনআপ (Memory Leak রোধ করতে)
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: "100%", 
        height: "600px", // আপনার প্রয়োজন মতো হাইট পরিবর্তন করতে পারেন
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
      }} 
    />
  );
};

export default TechSphere;