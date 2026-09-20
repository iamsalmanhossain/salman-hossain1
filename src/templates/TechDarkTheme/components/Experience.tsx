"use client";

import { motion, Variants } from "framer-motion";
import { Briefcase, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExperienceService } from "@/services/experience.service";

export default function Experience() {
  const { data: experiencesData } = useQuery({
    queryKey: ['experience'],
    queryFn: () => ExperienceService.getExperiences(),
  });

  const experiences = experiencesData?.data || [];
  const homeExperiences = experiences.slice(0, 3); // Show only top 3 on home page

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
            Experience
          </h2>
          <div className="w-16 h-1 bg-black dark:bg-white rounded-none" />
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
            {homeExperiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={exp.id} 
                  variants={itemVariants}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}
                >
                  
                  {/* Timeline Icon */}
                  <div className="absolute left-[11px] sm:left-1/2 w-8 h-8 rounded-none bg-black dark:bg-white border-2 border-white dark:border-[#0A0A0A] sm:-translate-x-1/2 z-10 flex items-center justify-center text-white dark:text-black shadow-lg">
                    <Briefcase className="w-4 h-4" />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-16 sm:ml-0 w-full sm:w-[calc(50%-2.5rem)] ${isEven ? 'sm:pr-10 sm:text-right' : 'sm:pl-10 text-left'}`}>
                    <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-none border border-black/10 dark:border-white/10 shadow-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 group">
                      
                      <div className={`flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">{new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {exp.position}
                      </h3>
                      
                      <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {exp.company}
                      </h4>
                      
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {exp.description}
                      </p>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* View Full Experience Button */}
        {experiences.length > 3 && (
          <div className="mt-20 flex justify-center">
            <Link 
              href="/experience" 
              className="group relative overflow-hidden px-8 py-4 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white font-semibold flex items-center justify-center transition-colors duration-300"
            >
              <span className="absolute inset-y-0 left-0 w-0 bg-black dark:bg-white transition-all duration-[400ms] ease-out group-hover:w-full z-0" />
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white dark:group-hover:text-black transition-colors duration-300 uppercase tracking-widest text-sm">
                View Full Experience
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
