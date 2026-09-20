"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import PixelSnow from "./components/PixelSnow";
import TargetCursor from "./components/TargetCursor";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Preloader from "@/components/Preloader";
import AboutPage from "./components/AboutPage";

export default function TechDarkAboutTheme() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("portfolio_visited")) {
      setLoadingComplete(true);
    } else {
        const timer = setTimeout(() => {
            sessionStorage.setItem("portfolio_visited", "true");
            setLoadingComplete(true);
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, []);

  const isLight = mounted && theme === 'light';

  return (
    <>
      <AnimatePresence>
        {!loadingComplete && (
          <Preloader isLoading={false} onLoadingComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {loadingComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="bg-white dark:bg-black min-h-screen w-full transition-colors duration-300"
        >
          <div className="relative w-full min-h-screen z-0">
            <TargetCursor cursorColor={isLight ? "#000000" : "#ffffff"} cursorColorOnTarget={isLight ? "#000000" : "#ffffff"} hideDefaultCursor={false} />
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
              <AboutPage />
              <Footer />
            </div>
            
            <ScrollToTop />
          </div>
        </motion.div>
      )}
    </>
  );
}
