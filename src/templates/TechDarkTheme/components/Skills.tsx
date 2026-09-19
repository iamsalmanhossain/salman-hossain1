"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SkillService } from "@/services/skill.service";

const TechSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => SkillService.getSkills(),
  });

  const apiSkills = skillsData?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mountRef.current || !mounted) return;

    const isLight = theme === 'light';

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

    // ৩. মাঝখানের Earth Sphere
    const sphereRadius = 8.5;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: isLight ? 0.95 : 0.85,
    });
    const earthSphere = new THREE.Mesh(sphereGeo, earthMat);
    scene.add(earthSphere);

    // Add Lights for the Earth
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.5 : 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, isLight ? 2 : 1.5);
    directionalLight.position.set(10, 15, 10);
    scene.add(directionalLight);

    // ৪. টেকনোলজি আইটেম তালিকা
    const colors = ["#326ce5", "#844fba", "#a97bff", "#00758f", "#ffca28", "#4285f4", "#78c257", "#e535ab", "#dea584", "#0089d6"];
    const visibleSkills = apiSkills.filter(s => s.showIn3d !== false);
    const techItems = visibleSkills.length > 0 ? visibleSkills.map((s, idx) => ({
      name: s.name,
      symbol: s.icon || '📌',
      color: colors[idx % colors.length]
    })) : [
      { name: "No Skills", symbol: "∅", color: "#a97bff" }
    ];

    // ক্যানভাসে আইকন + টেক্সট ড্র করে স্প্রাইট তৈরি করার ফাংশন
    const createIconSprite = (item: { name: string; symbol: string; color: string }) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.2, 3.2, 1);

      if (ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isLight ? "#1a202c" : "#cfd8dc";
        ctx.font = "bold 26px monospace";
        ctx.fillText(item.name, 128, 200);

        if (item.symbol.startsWith('http') || item.symbol.startsWith('/') || item.symbol.startsWith('data:image')) {
          const img = new window.Image();
          
          let imageSrc = item.symbol;
          if (item.symbol.startsWith('http')) {
             // Use our local proxy to avoid canvas CORS tainting issues
             imageSrc = `/api/proxy-image?url=${encodeURIComponent(item.symbol)}`;
          } else {
             // For relative paths or data URIs, we don't need proxy but might need crossOrigin for external relative? Not usually.
          }
          
          img.onload = () => {
            // Draw image scaled down
            ctx.drawImage(img, 78, 40, 100, 100);
            texture.needsUpdate = true;
          };
          img.onerror = (e) => {
            console.error("Image failed to load on 3D globe:", item.symbol, e);
            // Fallback to first letter if image fails to load
            ctx.fillStyle = item.color;
            ctx.font = "bold 85px sans-serif";
            ctx.fillText(item.name.charAt(0) || "📌", 128, 100);
            texture.needsUpdate = true;
          };

          img.src = imageSrc;
        } else {
          ctx.fillStyle = item.color;
          ctx.font = "bold 85px sans-serif";
          // Check if symbol is a long broken string
          const displaySymbol = item.symbol.length > 2 && !item.symbol.includes('️') ? item.name.charAt(0) : item.symbol;
          ctx.fillText(displaySymbol, 128, 100);
          texture.needsUpdate = true;
        }
      }

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

      earthSphere.add(sprite);
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
  }, [theme, mounted, apiSkills]);

  const skillCategories = [
    {
      title: "Frontend Development",
      skills: apiSkills.filter(s => s.category === 'FRONTEND').map(s => ({ name: s.name, icon: s.icon || '⚛️' }))
    },
    {
      title: "Backend Development",
      skills: apiSkills.filter(s => s.category === 'BACKEND').map(s => ({ name: s.name, icon: s.icon || '🟢' }))
    },
    {
      title: "Database",
      skills: apiSkills.filter(s => s.category === 'DATABASE').map(s => ({ name: s.name, icon: s.icon || '🐬' }))
    },
    {
      title: "DevOps & Cloud",
      skills: apiSkills.filter(s => s.category === 'DEVOPS').map(s => ({ name: s.name, icon: s.icon || '☁' }))
    },
    {
      title: "Tools & Languages",
      skills: apiSkills.filter(s => s.category === 'TOOL').map(s => ({ name: s.name, icon: s.icon || '⚙️' }))
    }
  ].filter(category => category.skills.length > 0);

  // Fallback if no skills are found at all
  if (skillCategories.length === 0) {
    skillCategories.push({
      title: "No Skills Added",
      skills: [{ name: "Please add skills in dashboard", icon: "⚠️" }]
    });
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="skills" className="w-full bg-transparent py-20 relative z-10 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

        <div className="flex flex-col gap-2 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Technical Skills
          </h2>
          <div className="w-16 h-1 bg-black dark:bg-white rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Side: 3D Earth */}
          <div className="order-2 lg:order-1 flex justify-center items-center">
            <div
              ref={mountRef}
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "600px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
            />
          </div>

          {/* Right Side: Categorized Skills Carousel */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center w-full relative">
            
            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white text-center uppercase tracking-widest mb-6">
              {skillCategories[activeIndex].title}
            </h3>

            {/* Content block with fixed height and side arrows */}
            <div className="flex items-center w-full gap-2 sm:gap-4 relative">
              
              <button 
                onClick={() => setActiveIndex((prev) => (prev - 1 + skillCategories.length) % skillCategories.length)} 
                className="p-2 rounded-full bg-white dark:bg-[#0E1015] hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm flex-shrink-0 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5 z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex-1 h-[600px] overflow-y-auto overflow-x-hidden rounded-2xl bg-white/50 dark:bg-[#1A1C23]/50 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-inner p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm mx-auto"
                  >
                    {skillCategories[activeIndex].skills.map((skill, sIdx) => (
                      <div 
                        key={sIdx} 
                        className="flex items-center gap-4 w-full group"
                      >
                        {/* Logo Box */}
                        <div className="flex-shrink-0 w-[56px] min-w-[56px] max-w-[56px] h-[56px] min-h-[56px] max-h-[56px] sm:w-[64px] sm:min-w-[64px] sm:max-w-[64px] sm:h-[64px] sm:min-h-[64px] sm:max-h-[64px] flex items-center justify-center bg-white dark:bg-[#0E1015] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all group-hover:border-emerald-500/50">
                          {skill.icon.startsWith('http') ? (
                             <img src={skill.icon} alt={skill.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform" />
                          ) : skill.icon.length > 2 && !skill.icon.includes('️') ? (
                             <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 transition-colors">{skill.icon}</span>
                          ) : (
                             <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                          )}
                        </div>
                        
                        {/* Name Box */}
                        <div className="flex-1 h-[56px] min-h-[56px] sm:h-[64px] sm:min-h-[64px] flex items-center px-6 bg-white dark:bg-[#0E1015] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all group-hover:border-emerald-500/50">
                          <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-emerald-500 transition-colors">{skill.name}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setActiveIndex((prev) => (prev + 1) % skillCategories.length)} 
                className="p-2 rounded-full bg-white dark:bg-[#0E1015] hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm flex-shrink-0 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

            </div>
            
            {/* Pagination dots */}
            <div className="flex gap-2 mt-6">
              {skillCategories.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-gradient-to-r from-blue-500 to-emerald-400 w-8' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default TechSphere;