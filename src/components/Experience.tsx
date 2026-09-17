"use client";

import { motion, Variants } from "framer-motion";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExperienceService } from "@/services/experience.service";

export default function Experience() {
  const { data: experiencesData } = useQuery({
    queryKey: ['experience'],
    queryFn: () => ExperienceService.getExperiences(),
  });

  const experiences = experiencesData?.data || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="experience" className="w-full bg-transparent py-20 relative z-10 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Experience & Education
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Vertical Line */}
          <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/10 sm:-translate-x-1/2" />

          <div className="flex flex-col gap-12 sm:gap-20">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={exp.id} 
                  variants={itemVariants}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}
                >
                  
                  {/* Timeline Icon */}
                  <div className="absolute left-[11px] sm:left-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 border-4 border-gray-50 dark:border-[#0A0A0A] sm:-translate-x-1/2 z-10 flex items-center justify-center text-white shadow-lg">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-16 sm:ml-0 w-full sm:w-[calc(50%-2.5rem)] ${isEven ? 'sm:pr-10 sm:text-right' : 'sm:pl-10 text-left'}`}>
                    <div className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                      
                      <div className={`flex items-center gap-2 mb-3 text-emerald-500 dark:text-emerald-400 ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">{new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                        {exp.position}
                      </h3>
                      
                      <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {exp.company}
                      </h4>
                      
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {exp.description}
                      </p>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
