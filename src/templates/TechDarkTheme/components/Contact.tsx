"use client";

import { motion, Variants } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
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

  return (
    <section id="contact" className="w-full bg-transparent py-20 relative z-10 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16 text-center items-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-lg">
            Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and creative ideas.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                <p className="text-lg font-bold text-black dark:text-white">hello@salmanhossain.com</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Location</h4>
                <p className="text-lg font-bold text-black dark:text-white">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-white/5 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                <p className="text-lg font-bold text-black dark:text-white">+880 1234-567890</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="bg-white/80 dark:bg-[#0E1015]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl h-full">
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="John Doe" 
                      className="px-5 py-4 bg-gray-50 dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-black dark:text-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="john@example.com" 
                      className="px-5 py-4 bg-gray-50 dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-black dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    placeholder="How can I help you?" 
                    className="px-5 py-4 bg-gray-50 dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-black dark:text-white transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    placeholder="Write your message here..." 
                    className="px-5 py-4 bg-gray-50 dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-black dark:text-white transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-2 py-4 bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
