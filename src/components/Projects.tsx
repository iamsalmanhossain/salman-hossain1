"use client";

import { motion, Variants } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

// Custom SVG Icons for Brands
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 9.6c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.5-5-2.5-7-3"></path>
  </svg>
);

export default function Projects() {
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => ProjectService.getProjects(),
  });

  const projects = projectsData?.data || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="projects" className="w-full bg-transparent py-20 relative z-10 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Featured Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={itemVariants}
              className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-[#0E1015]">
                {/* Fallback pattern if image is broken */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-10 transition-opacity">
                  <FolderGit2 className="w-16 h-16" />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300" />
                
                {/* Add Image component if real URLs are available, using div for now to avoid broken image icons */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-400/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Content Container */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies?.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 text-xs font-medium bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg border border-black/5 dark:border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 mt-auto">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center p-2.5 bg-gray-100 dark:bg-white/5 text-black dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
