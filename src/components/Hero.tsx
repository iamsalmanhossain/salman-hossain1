"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Users, ChevronRight, Mail, Sparkles, ChevronDown } from "lucide-react";
import GlowCursor from "./GlowCursor";

// Custom SVG Icons for Brands
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 9.6c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.5-5-2.5-7-3"></path>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="h-screen relative overflow-hidden bg-white dark:bg-transparent text-black dark:text-white transition-colors duration-300 w-full">
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
        className="w-full h-full"
      >
        <div className="flex items-center justify-center w-full h-full px-4 sm:px-8 lg:px-16 pt-10 pb-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center z-10 relative w-full">
            
            {/* Left Column - Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mx-auto lg:ml-auto order-2 lg:order-1 max-w-[16rem] sm:max-w-[20rem] lg:max-w-[22rem] w-full"
            >
              {/* Decorative background shapes */}
              <div className="absolute -top-3 -right-3 w-full h-full bg-[#E5ECE9] dark:bg-[#1A362D] rounded-3xl -z-10 transition-colors duration-300" />
              <div className="absolute -bottom-3 -left-3 w-full h-full bg-[#E5ECE9] dark:bg-[#1A362D] rounded-3xl -z-10 transition-colors duration-300" />
              
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-gray-200 dark:bg-[#382F75] transition-colors duration-300 shadow-2xl">
                 <div className="w-full h-full relative">
                   <Image 
                     src="https://i.ibb.co/JwJPT9qY/profile-Fb.jpg" 
                     alt="Profile" 
                     fill
                     className="object-cover" 
                     priority
                     unoptimized
                   />
                 </div>
              </div>

              {/* Available Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-5 left-4 sm:-bottom-4 sm:left-6 bg-white dark:bg-[#0E1513] border border-gray-200 dark:border-[#1A362D] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 shadow-xl transition-colors duration-300"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
              </motion.div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="order-1 lg:order-2 flex flex-col items-start text-left mx-auto lg:mx-0 max-w-lg w-full pointer-events-none"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-4 transition-colors duration-300 pointer-events-auto">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">UI/UX En</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 pointer-events-auto">
                <span className="text-gray-500 dark:text-gray-400 font-light">Hello, I am</span>{" "}
                <span className="text-black dark:text-white transition-colors duration-300">Abass Alzouma</span>
              </motion.h1>

              {/* A small underline accent */}
              <motion.div variants={itemVariants} className="w-12 h-1 bg-[#4ade80] rounded-full mb-4 pointer-events-auto" />

              <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-4 max-w-xl pointer-events-auto">
                Passionate web and mobile developer with over 6 years of experience in programming and web technologies. 
                Through my work, I turn ideas into modern visual and digital experiences by combining web development, 
                graphic design, motion design, video editing, and content creation.
              </motion.p>

              <motion.a variants={itemVariants} href="#" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-xs font-medium underline underline-offset-4 mb-6 block pointer-events-auto">
                What AI is saying about me.
              </motion.a>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 w-full max-w-md mb-6 pointer-events-auto">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1 transition-colors duration-300">6+</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Years of Experience</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1 transition-colors duration-300">35+</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Projects Completed</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1 transition-colors duration-300">10+</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Tools & Tech</p>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6 pointer-events-auto">
                <button className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer">
                  More About Me
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button className="px-5 py-2.5 text-sm bg-gray-100 dark:bg-[#1A1C23] hover:bg-gray-200 dark:hover:bg-[#252833] text-black dark:text-white font-medium rounded-lg flex items-center gap-2 transition-colors border border-gray-200 dark:border-white/5 cursor-pointer">
                  Join the forum
                  <Users className="w-3.5 h-3.5" />
                </button>
                <button className="px-5 py-2.5 text-sm bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white font-medium rounded-lg flex items-center gap-2 transition-colors border border-black/10 dark:border-white/10 cursor-pointer">
                  Download Resume
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 border-t border-black/10 dark:border-white/10 pt-4 w-full max-w-lg transition-colors duration-300 pointer-events-auto">
                <span className="text-xs text-gray-500 dark:text-gray-400">Connect with me:</span>
                <div className="flex gap-2.5">
                  {[GithubIcon, TwitterIcon, LinkedinIcon, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer">
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </GlowCursor>
    </section>
  );
}
