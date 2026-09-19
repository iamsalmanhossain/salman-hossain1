"use client";

import { motion, Variants } from "framer-motion";
import { User, Mail, MapPin, Calendar, CheckCircle2, ArrowUpRight } from "lucide-react";

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

export default function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const details = [
    { icon: User, label: "Name", value: "Salman Hossain" },
    { icon: Mail, label: "Email", value: "hello@example.com" },
    { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
    { icon: Calendar, label: "Age", value: "24 Years" },
  ];

  const highlights = [
    "Frontend Development",
    "UI/UX Design",
    "Responsive Web Design",
    "Interactive Web Apps",
    "Performance Optimization",
    "Motion Graphics"
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-8 lg:px-16 w-full bg-transparent transition-colors duration-300 relative z-10">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-12"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
              About Me
            </motion.h2>
            <motion.div variants={itemVariants} className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Bio Card (Spans 2 columns on large screens) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 dark:bg-[#0E1015]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-emerald-400 transition-colors">
                A passionate developer creating interactive experiences.
              </h3>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed space-y-6">
                <p>
                  With a solid background in software engineering and a keen eye for design, I specialize in building responsive, high-performance web applications that provide exceptional user experiences. 
                </p>
                <p>
                  My journey began several years ago, and since then, I have continuously expanded my skillset to include the latest web technologies, interactive animations, and modern design principles. I thrive in environments where creativity and logic intersect, turning complex problems into elegant, user-friendly solutions.
                </p>
              </div>
            </motion.div>

            {/* Personal Details Card */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0E1015]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-black dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
                Personal Details
              </h3>
              <ul className="flex flex-col gap-6">
                {details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-blue-500 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{detail.label}</span>
                      <span className="text-sm sm:text-base font-medium text-black dark:text-white">{detail.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Highlights Card */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0E1015]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300">
               <h3 className="text-xl font-bold text-black dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
                My Focus Areas
              </h3>
              <div className="flex flex-col gap-4">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-500 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-emerald-400 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                 <ArrowUpRight className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Let's work together!</h3>
                <p className="text-white/80 text-sm font-medium mb-8">I'm currently available for freelance projects and full-time roles.</p>
              </div>
              <button className="relative z-10 w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                Hire Me Now
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Social Links Card */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0E1015]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-bold text-black dark:text-white mb-6">
                Connect Online
              </h3>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                   <LinkedinIcon className="w-6 h-6" />
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-800 hover:text-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                   <GithubIcon className="w-6 h-6" />
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                   <TwitterIcon className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
