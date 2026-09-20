"use client";

import { useQuery } from "@tanstack/react-query";
import { getAboutSections } from "@/services/about.service";
import { ExperienceService } from "@/services/experience.service";
import { EducationService } from "@/services/education.service";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  MoveLeft, Download, Briefcase, GraduationCap, MapPin, 
  Calendar, Mail, ExternalLink, Code2, Users, Smile, User, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ResumeModal } from "./ResumeModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const { data: aboutData } = useQuery({
    queryKey: ['aboutSections'],
    queryFn: () => getAboutSections(),
  });

  const { data: expData } = useQuery({
    queryKey: ['experience'],
    queryFn: () => ExperienceService.getExperiences(),
  });

  const { data: eduData } = useQuery({
    queryKey: ['education'],
    queryFn: () => EducationService.getEducations(),
  });

  const about = aboutData?.data && aboutData.data.length > 0 ? aboutData.data[0] : null;
  const experiences = expData?.data || [];
  const education = eduData?.data || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (!about) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-transparent pb-24 overflow-hidden text-black dark:text-white font-sans ">
      
      {/* Back Button */}
      <div className="pt-8 px-6 md:px-12 xl:px-24">
        <Link href="/" className="group relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-sm font-medium transition-colors w-max">
          <span className="absolute inset-y-0 left-0 w-0 bg-black dark:bg-white transition-all duration-500 ease-out group-hover:w-full z-0" />
          <span className="relative z-10 flex items-center gap-2 group-hover:text-white dark:group-hover:text-black transition-colors duration-500 text-black dark:text-white">
            <MoveLeft className="w-4 h-4" />
            Back to Home
          </span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 md:px-12 xl:px-24 max-w-[1400px] mx-auto">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center"
        >
          {/* Left Content */}
          <div className="lg:col-span-7 xl:col-span-8 z-10">
            {/* ABOUT ME Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-[#111]/50 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 bg-black dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 dark:text-gray-300">About Me</span>
            </motion.div>
            
            {/* Massive Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-black tracking-tighter mb-2 leading-[1.1] text-black dark:text-white">
              I'm <span className="text-black dark:text-white">{about.name}.</span>
            </motion.h1>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-snug text-gray-700 dark:text-gray-200">
              {about.headline}
            </motion.h2>

            {/* Short Bio */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-normal leading-relaxed max-w-3xl mb-10">
              {about.shortBio}
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link 
                href="/#contact" 
                className="group relative overflow-hidden px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center border border-black/20 dark:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] w-full sm:w-auto"
              >
                <span className="absolute inset-y-0 left-0 w-0 bg-gray-800 dark:bg-black transition-all duration-500 ease-out group-hover:w-full z-0" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                  <Mail className="w-4 h-4" />
                  Contact Me
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              {about.resumeUrl && (
                <button 
                  onClick={() => setIsResumeModalOpen(true)}
                  className="group relative overflow-hidden px-8 py-3.5 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white font-medium flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] w-full sm:w-auto"
                >
                  <span className="absolute inset-y-0 left-0 w-0 bg-black dark:bg-white transition-all duration-500 ease-out group-hover:w-full z-0" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                    <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    View Resume
                  </span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 xl:col-span-4 relative flex justify-center lg:justify-end">
            <motion.div variants={fadeUp} className="relative w-[300px] sm:w-[380px] aspect-[3/4] group">
              {/* Cyan Offset Border */}
              <div className="absolute top-6 left-6 w-full h-full border-2 border-black/20 dark:border-white/20 -z-10" />
              
              {/* Image Container with Glow */}
              <div className="w-full h-full overflow-hidden bg-white dark:bg-[#111] relative shadow-lg dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-black/10 dark:border-white/10">
                {about.profileImage && (
                  <img 
                    src={about.profileImage} 
                    alt={about.name} 
                    className="w-full h-full object-cover z-0 relative" 
                  />
                )}
              </div>
              
              {/* Experience Floating Badge */}
              <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 p-5 shadow-2xl flex items-center gap-4 z-20">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black dark:text-white">{about.experienceYears}+</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Months Experience</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 grid grid-cols-3 gap-2 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-black dark:bg-white" />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* My Story & Stats Box */}
      <section className="relative px-6 md:px-12 xl:px-24 max-w-[1400px] mx-auto mt-12 mb-20 z-10">
        <div className="bg-white/[0.03] backdrop-blur-xs border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden group/gloss">
          
          {/* Glossy Overlay Reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/1 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          {/* Left: Small Image & Signature */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-6 hidden sm:flex">
            <div className="w-full max-w-[240px] aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#040814] border border-black/20 dark:border-white/20 relative">
               {about.profileImage && (
                  <img 
                    src={about.profileImage} 
                    alt={about.name} 
                    className="w-full h-full object-cover" 
                  />
                )}
            </div>
            <div className="font-['Brush_Script_MT',cursive] text-3xl text-black/80 dark:text-white/80 -rotate-2 -mt-10 bg-white/80 dark:bg-black/80 px-4 py-1 backdrop-blur-sm relative z-10">
              {about.name}
            </div>
          </div>

          {/* Right: Story & Stats */}
          <div className="lg:col-span-9 flex flex-col gap-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-black dark:text-white" /> My Story
              </h2>
              <div className="text-gray-700 dark:text-gray-400 text-base md:text-lg leading-loose font-normal">
                <p className="whitespace-pre-wrap">{about.description}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4 relative z-10">
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black dark:text-white">{about.experienceYears}+</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mt-1">Years of Experience</div>
                </div>
              </div>
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black dark:text-white">{about.projectsCount}+</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mt-1">Projects Completed</div>
                </div>
              </div>
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Smile className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black dark:text-white">{about.clientsCount}+</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mt-1">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timelines Section */}
      <section className="px-6 md:px-12 xl:px-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Work Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-black dark:text-white">
              <Briefcase className="w-6 h-6 text-black dark:text-white" /> Work Experience
            </h2>
            <div className="relative border-l-2 border-black/5 dark:border-white/5 ml-3 flex flex-col gap-12">
              {experiences.map((exp: any, index: number) => (
                <div key={exp.id || index} className="relative pl-8 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-125 transition-transform duration-300" />
                  
                  <div className="flex flex-col xl:flex-row xl:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-black dark:text-white">{exp.position}</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(exp.startDate)} — {exp.isCurrentRole ? "Present" : formatDate(exp.endDate)}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {exp.location || "Remote"}</span>
                    </div>
                  </div>
                  
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-4">{exp.companyName}</span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-normal">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-black dark:text-white">
              <GraduationCap className="w-6 h-6 text-black dark:text-white" /> Education
            </h2>
            <div className="relative border-l-2 border-black/5 dark:border-white/5 ml-3 flex flex-col gap-12">
              {education.map((edu: any, index: number) => (
                <div key={edu.id || index} className="relative pl-8 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-125 transition-transform duration-300" />
                  
                  <div className="flex flex-col xl:flex-row xl:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-black dark:text-white">{edu.degree}</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : formatDate(edu.endDate)}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {edu.location || "Bangladesh"}</span>
                    </div>
                  </div>
                  
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-4">{edu.institution}</span>
                  {edu.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-normal">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {isResumeModalOpen && about?.resumeUrl && (
          <ResumeModal url={about.resumeUrl} onClose={() => setIsResumeModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
