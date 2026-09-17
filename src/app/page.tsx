"use client";

import Image from "next/image";
import PixelSnow from "./PixelSnow";
import Hero from "../components/Hero";
import About from "../components/About";
import TechSphere from "@/components/Skills";
import GlowCursor from "../components/GlowCursor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === 'light';

  return (
    <GlowCursor
      color={isLight ? "#0ea5e9" : "#67E8F9"}
      secondaryColor={isLight ? "#8b5cf6" : "#A78BFA"}
      trailLength={40}
      trailWidth={8}
      trailTaper={0.8}
      followSpeed={0.16}
      glowIntensity={isLight ? 2.5 : 1.9}
      glowSpread={1.2}
      hotspot={0.65}
      brightness={1.25}
      opacity={isLight ? 0.8 : 1}
      pulseSpeed={1.1}
      noiseStrength={0.035}
      idleFade
      idleTimeout={700}
      fadeDuration={900}
      blendMode={isLight ? "normal" : "screen"}
      className="w-full min-h-screen z-[100]"
    >
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <PixelSnow
          color={isLight ? "#000000" : "#ffffff"}
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={0}
          brightness={isLight ? 0.5 : 1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>
      <Hero />
      <About />
      <TechSphere />
    </GlowCursor>
  );
}
