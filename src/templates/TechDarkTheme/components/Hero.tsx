"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

function AnimatedCounter({ from = 0, to = 100, duration = 2 }: { from?: number; to: number; duration?: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
}
import { ExternalLink, Users, ChevronRight, Mail, Sparkles, MoveRight, X, ChevronDown, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSectionService } from "@/services/heroSection.service";

const DefaultIcon = ({ className }: { className?: string }) => (
  <ExternalLink className={className} />
);

import { ResumeModal } from "./ResumeModal";
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";
  const [currentDesignationIndex, setCurrentDesignationIndex] = useState(0);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const { data: heroData } = useQuery({
    queryKey: ['hero'],
    queryFn: () => HeroSectionService.getHeroSection(),
  });

  const hero = heroData?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hero?.designations || hero.designations.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDesignationIndex((prev) => (prev + 1) % hero.designations.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [hero?.designations]);

  // Framer Motion Variants for B&W minimalist animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textRevealVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
    }
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-transparent text-black dark:text-white w-full flex items-center justify-center pt-24 lg:pt-0 pb-16 lg:pb-0 selection:bg-white selection:text-black">

      {/* Background B&W Grid & Grain */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at center, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>


      <div className="w-full h-full px-6 sm:px-10 lg:px-16 flex items-center justify-center z-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 w-full"
          >
            {/* Dynamic Designation Badge */}
            {hero?.designations && hero.designations.length > 0 && (
              <motion.div variants={fadeUpVariants} className="mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <div className="h-5 overflow-hidden relative w-[160px] sm:w-[180px] text-left">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentDesignationIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 tracking-wide uppercase"
                      >
                        {hero.designations[currentDesignationIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Title */}
            <div className="overflow-hidden mb-6 w-full perspective-[1000px]">
              <motion.h1 variants={textRevealVariants} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] text-black dark:text-white">
                <span className="block text-gray-600 dark:text-gray-500 font-medium tracking-normal text-2xl sm:text-3xl mb-4">Hello, I am</span>
                <span className="inline-flex flex-wrap gap-x-4">
                  {(hero?.heroTitle || "Salman Hossain").split(' ').map((word: string, i: number) => (
                    <span key={i} className="inline-flex overflow-hidden">
                      {word.split('').map((char: string, j: number) => (
                        <motion.span
                          key={`${i}-${j}`}
                          variants={letterVariants}
                          className="inline-block origin-bottom"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </span>
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-10 w-full max-w-2xl">
              <motion.p variants={textRevealVariants} className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed font-light">
                {hero?.heroDescription || "I build robust backend systems and beautiful web applications."}
              </motion.p>
            </div>

            {/* Minimalist Stats */}
            <motion.div variants={fadeUpVariants} className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-xl mb-12 border-y border-black/10 dark:border-white/10 py-6">
              <div className="flex flex-col items-center lg:items-start group">
                <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2 tracking-tighter flex items-center">
                  <AnimatedCounter to={Number(hero?.experienceYears) || 5} duration={2} />
                  <span className="text-black dark:text-white/50 ml-1">+</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest font-semibold group-hover:text-black dark:text-white transition-colors duration-300">Years Exp.</p>
              </div>
              <div className="flex flex-col items-center lg:items-start border-l border-black/10 dark:border-white/10 pl-4 sm:pl-8 group">
                <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2 tracking-tighter flex items-center">
                  <AnimatedCounter to={Number(hero?.totalProjects) || 50} duration={2.5} />
                  <span className="text-black dark:text-white/50 ml-1">+</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest font-semibold group-hover:text-black dark:text-white transition-colors duration-300">Projects</p>
              </div>
              <div className="flex flex-col items-center lg:items-start border-l border-black/10 dark:border-white/10 pl-4 sm:pl-8 group">
                <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2 tracking-tighter flex items-center">
                  <AnimatedCounter to={Number(hero?.totalToolsAndTech) || 30} duration={3} />
                  <span className="text-black dark:text-white/50 ml-1">+</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest font-semibold group-hover:text-black dark:text-white transition-colors duration-300">Technologies</p>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
              <Link href="/about" className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold flex items-center justify-center transition-colors duration-300">
                <span className="absolute inset-y-0 left-0 w-0 bg-black transition-all duration-[400ms] ease-out group-hover:w-full z-0" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                  More About Me
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              {hero?.resumeUrl && (
                <button onClick={() => setIsResumeModalOpen(true)} className="cursor-pointer group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white font-semibold flex items-center justify-center transition-colors duration-300">
                  <span className="absolute inset-y-0 left-0 w-0 bg-black dark:bg-white transition-all duration-[400ms] ease-out group-hover:w-full z-0" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                    View Resume
                    <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              )}
              <Link href="#contact" className="hidden sm:flex group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold items-center justify-center transition-colors duration-300">
                <span className="absolute inset-y-0 left-0 w-0 bg-white dark:bg-black transition-all duration-[400ms] ease-out group-hover:w-full z-0" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                  Let's Talk
                </span>
              </Link>
            </motion.div>

            {/* Interactive Social Links */}
            <motion.div variants={fadeUpVariants} className="relative h-12 flex items-center w-full justify-center lg:justify-start group cursor-pointer mb-8">
              {/* Default text boxes */}
              <div className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 flex items-center gap-2 pointer-events-none">
                {["C", "O", "N", "T", "A", "C", "T"].map((letter, idx) => (
                  <div
                    key={idx}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                    className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#1A1A1A] flex items-center justify-center border border-black/10 dark:border-white/10 shadow-lg transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:-translate-y-4"
                  >
                    <span className="text-black dark:text-white font-black text-sm">{letter}</span>
                  </div>
                ))}
              </div>

              {/* Icons to reveal */}
              <div className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 flex items-center gap-2">
                {[...Array(7)].map((_, i) => {
                  const activeLinks = hero?.socialLinks?.filter((l: any) => l.isActive) || [];
                  const link = activeLinks[i];

                  if (link) {
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ transitionDelay: `${i * 50}ms` }}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:!scale-110 overflow-hidden"
                      >
                        {link.iconUrl ? (
                          <Image src={link.iconUrl} alt={link.platform} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <DefaultIcon className="w-6 h-6 text-black" />
                        )}
                      </a>
                    );
                  }

                  // Empty placeholder for maintaining width
                  return (
                    <div
                      key={i}
                      style={{ transitionDelay: `${i * 50}ms` }}
                      className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none"
                    />
                  );
                })}
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column - Image (Order 1 on mobile, Order 2 on LG) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end order-1 lg:order-2 w-full mb-8 lg:mb-0"
          >
            <div className="relative w-64 h-80 sm:w-80 sm:h-[400px] lg:w-[400px] lg:h-[500px]">

              {/* Minimalist Border Box */}
              <div className="absolute inset-0 border border-black/20 dark:border-white/20 translate-x-4 translate-y-4 lg:translate-x-6 lg:translate-y-6 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />

              <div className="w-full h-full relative overflow-hidden bg-white dark:bg-[#111] z-10 grayscale hover:grayscale-0 transition-all duration-700 border border-black/10 dark:border-white/10">
                {hero?.profileImage && (
                  <Image
                    src={hero.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                    unoptimized
                  />
                )}
                {/* Monochrome overlay */}
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
              </div>

              {/* Floating B&W Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute -left-6 lg:-left-12 bottom-12 bg-white text-black p-4 shadow-2xl flex items-center gap-4 z-20"
              >
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500">Currently</p>
                  <p className="text-sm font-black uppercase tracking-wider">Available</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down Animation */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-widest text-black dark:text-white/50 font-bold mb-1">Scroll Down</span>
        <ChevronDown className="w-6 h-6 text-black dark:text-white" />
      </motion.div>

      <AnimatePresence>
        {isResumeModalOpen && hero?.resumeUrl && (
          <ResumeModal url={hero.resumeUrl} onClose={() => setIsResumeModalOpen(false)} />
        )}
      </AnimatePresence>

    </section>
  );
}
