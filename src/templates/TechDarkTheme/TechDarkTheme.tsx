import React from "react";
import { motion } from "framer-motion";
import PixelSnow from "./components/PixelSnow";
import Hero from "./components/Hero";
import About from "./components/About";
import TechSphere from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GlowCursor from "./components/GlowCursor";
import Sidebar from "@/components/Sidebar";

export default function TechDarkTheme({ websiteData, isLight, mounted }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
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
        className="w-full min-h-screen z-0"
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

        <Sidebar />
        <div className="md:pl-20">
          {/* Dynamic sections based on template data */}
          {websiteData.showHero !== false && <Hero />}
          {websiteData.showAbout !== false && <About />}
          <TechSphere />
          <Experience />
          {websiteData.showProjects !== false && <Projects />}
          {websiteData.showBlog !== false && <Blog />}
          <Contact />
          <Footer />
        </div>
      </GlowCursor>
    </motion.div>
  );
}
