"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
    "Interactive Web Apps"
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-8 lg:px-16 w-full bg-gray-50 dark:bg-[#0E1015] transition-colors duration-300 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Biography */}
            <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
                A passionate developer creating interactive experiences.
              </h3>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  With a solid background in software engineering and a keen eye for design, I specialize in building responsive, high-performance web applications that provide exceptional user experiences. 
                </p>
                <p>
                  My journey began several years ago, and since then, I have continuously expanded my skillset to include the latest web technologies, interactive animations, and modern design principles. I thrive in environments where creativity and logic intersect.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Personal Details */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <div className="bg-white dark:bg-[#1A1C23] p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg flex flex-col gap-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-black dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                  Personal Details
                </h3>
                
                <ul className="flex flex-col gap-5">
                  {details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg text-blue-500 dark:text-cyan-400 shrink-0">
                        <detail.icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{detail.label}</span>
                        <span className="text-sm sm:text-base font-medium text-black dark:text-white">{detail.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-emerald-500/20 cursor-pointer">
                  Hire Me
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}










