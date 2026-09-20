"use client";

import { IAbout } from "@/types/about";
import { useQuery } from "@tanstack/react-query";
import { getAboutSections } from "@/services/about.service";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { MoveRight, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ResumeModal } from "./ResumeModal";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function About({ data: initialData }: { data?: IAbout }) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { data: aboutData } = useQuery({
    queryKey: ['aboutSections'],
    queryFn: () => getAboutSections(),
    enabled: !initialData,
  });

  const data = initialData || (aboutData?.data && aboutData.data.length > 0 ? aboutData.data[0] : null);

  if (!data) return null;

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          
          {/* Image Side */}
          <motion.div variants={fadeUp} className="relative group">
            {data.profileImage && (
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden bg-gray-100 dark:bg-[#111]">
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={data.profileImage} 
                  alt={data.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                />
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-black dark:bg-white z-20" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-black dark:bg-white z-20" />
              </div>
            )}
            
            {/* Experience Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -right-2 sm:-right-6 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 p-5 shadow-2xl backdrop-blur-xl z-30 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl font-bold">
                {data.experienceYears}+
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Years of<br />Experience</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <div className="flex flex-col justify-center">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-black dark:bg-white" />
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-gray-400">Discover More</h2>
            </motion.div>
            
            <motion.h3 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6 leading-snug">
              {aboutData?.data?.[0]?.name ? `Hello, I'm ${aboutData.data[0].name}` : "Creative Developer & Tech Enthusiast"}
            </motion.h3>
            
            {/* The headline was too long, so we style it as a prominent but smaller subtitle */}
            <motion.div variants={fadeUp} className="mb-6 pb-6 border-b border-black/10 dark:border-white/10">
              <p className="text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                {data.headline}
              </p>
            </motion.div>
            
            <motion.p variants={fadeUp} className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-loose max-w-xl">
              {data.shortBio}
            </motion.p>
            
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                   <span className="text-xl font-bold text-black dark:text-white">{data.projectsCount}+</span>
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Completed<br/>Projects</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                   <span className="text-xl font-bold text-black dark:text-white">{data.clientsCount}+</span>
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Happy<br/>Clients</p>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link href="/about" className="group relative overflow-hidden px-8 py-4 bg-white text-black font-bold flex items-center justify-center border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] w-full sm:w-auto">
                <span className="absolute inset-y-0 left-0 w-0 bg-black transition-all duration-500 ease-out group-hover:w-full z-0" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  Read Full Bio
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
            </motion.div>
          </div>
          
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isResumeModalOpen && data?.resumeUrl && (
          <ResumeModal url={data.resumeUrl} onClose={() => setIsResumeModalOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
