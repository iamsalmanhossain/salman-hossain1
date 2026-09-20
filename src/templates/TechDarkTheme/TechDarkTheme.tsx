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
import TargetCursor from "./components/TargetCursor";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

export default function TechDarkTheme({ websiteData, isLight, mounted }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="bg-gray-50 dark:bg-black min-h-screen w-full transition-colors duration-300"
    >
      <div className="relative w-full min-h-screen z-0">
        <TargetCursor cursorColor="#ffffff" cursorColorOnTarget="#ffffff" hideDefaultCursor={false} />
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
        <ScrollToTop />
      </div>
    </motion.div>
  );
}
