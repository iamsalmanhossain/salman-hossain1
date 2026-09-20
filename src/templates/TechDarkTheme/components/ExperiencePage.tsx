"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, GraduationCap, Building2, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExperienceService } from "@/services/experience.service";
import { EducationService } from "@/services/education.service";
import { CertificateService } from "@/services/certificate.service";

type TabType = "experience" | "education" | "certificates";

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState<TabType>("experience");

  const { data: experiencesData } = useQuery({
    queryKey: ['experience'],
    queryFn: () => ExperienceService.getExperiences(),
  });

  const { data: educationData } = useQuery({
    queryKey: ['education'],
    queryFn: () => EducationService.getEducations(),
  });

  const { data: certificatesData } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => CertificateService.getCertificates(),
  });

  const experiences = experiencesData?.data || [];
  const educations = educationData?.data || [];
  const certificates = certificatesData?.data || [];

  const tabs = [
    { id: "experience", label: "Work Experience", icon: Briefcase, count: experiences.length },
    { id: "education", label: "Education", icon: GraduationCap, count: educations.length },
    { id: "certificates", label: "Certificates", icon: Award, count: certificates.length },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.15 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="w-full min-h-screen bg-transparent pt-32 pb-20 relative z-10 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-black dark:bg-white" />
            <span className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold">
              My Journey
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-8">
            Experience &<br />Education
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-black/10 dark:border-white/10 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            if (tab.count === 0) return null; // Don't show tab if no data

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative px-6 py-4 flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isActive 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                {tab.label}
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-[-17px] left-0 right-0 h-1 bg-black dark:bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* Experience Content */}
            {activeTab === "experience" && experiences.length > 0 && (
              <motion.div
                key="experience"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative max-w-5xl mx-auto py-10"
              >
                <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-black/10 dark:bg-white/10 sm:-translate-x-1/2" />
                <div className="flex flex-col gap-16">
                  {experiences.map((exp, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <motion.div key={exp.id} variants={itemVariants} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="absolute left-[11px] sm:left-1/2 w-8 h-8 rounded-none bg-black dark:bg-white border-2 border-white dark:border-[#0A0A0A] sm:-translate-x-1/2 z-10 flex items-center justify-center text-white dark:text-black shadow-lg">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className={`ml-16 sm:ml-0 w-full sm:w-[calc(50%-3rem)] ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 text-left'}`}>
                          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-none border border-black/10 dark:border-white/10 shadow-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 group">
                            <div className={`flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-semibold uppercase tracking-wider">
                                {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                              </span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{exp.position}</h3>
                            <div className={`flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                              <Building2 className="w-4 h-4" />
                              <h4 className="text-lg font-semibold">{exp.company}</h4>
                            </div>
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Education Content */}
            {activeTab === "education" && educations.length > 0 && (
              <motion.div
                key="education"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative max-w-5xl mx-auto py-10"
              >
                <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-black/10 dark:bg-white/10 sm:-translate-x-1/2" />
                <div className="flex flex-col gap-16">
                  {educations.map((edu, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <motion.div key={edu.id} variants={itemVariants} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="absolute left-[11px] sm:left-1/2 w-8 h-8 rounded-none bg-black dark:bg-white border-2 border-white dark:border-[#0A0A0A] sm:-translate-x-1/2 z-10 flex items-center justify-center text-white dark:text-black shadow-lg">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className={`ml-16 sm:ml-0 w-full sm:w-[calc(50%-3rem)] ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 text-left'}`}>
                          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-none border border-black/10 dark:border-white/10 shadow-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 group">
                            <div className={`flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-semibold uppercase tracking-wider">
                                {edu.startYear} - {edu.endYear ? edu.endYear : "Present"}
                              </span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{edu.degree}</h3>
                            <div className={`flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                              <Building2 className="w-4 h-4" />
                              <h4 className="text-lg font-semibold">{edu.institute}</h4>
                            </div>
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{edu.field}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Certificates Content - Grid Layout */}
            {activeTab === "certificates" && certificates.length > 0 && (
              <motion.div
                key="certificates"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10"
              >
                {certificates.map((cert) => (
                  <motion.div 
                    key={cert.id} 
                    variants={itemVariants} 
                    className="group flex flex-col bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300"
                  >
                    {/* Visual Image Section */}
                    {cert.image ? (
                      <div className="w-full aspect-[4/3] overflow-hidden bg-black/10 dark:bg-white/10 relative border-b border-black/10 dark:border-white/10">
                        <img 
                          src={cert.image} 
                          alt={cert.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-black/5 dark:bg-white/5 flex items-center justify-center border-b border-black/10 dark:border-white/10">
                        <Award className="w-16 h-16 text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors duration-300" />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      {cert.issueDate && (
                        <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">{new Date(cert.issueDate).getFullYear()}</span>
                        </div>
                      )}
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                        <Building2 className="w-4 h-4" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider">{cert.issuer}</h4>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10">
                        {cert.credentialUrl ? (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white hover:opacity-50 transition-opacity"
                          >
                            View Credential
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
