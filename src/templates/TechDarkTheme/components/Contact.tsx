"use client";

import { motion, Variants } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ContactService } from "@/services/contact.service";
import { useQuery } from "@tanstack/react-query";
import { HeroSectionService } from "@/services/heroSection.service";

export default function Contact() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const { data: heroData } = useQuery({
    queryKey: ['hero'],
    queryFn: () => HeroSectionService.getHeroSection(),
  });

  const hero = heroData?.data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await ContactService.sendMessage({ ...formData, status: "UNREAD" as any });
      setSubmitStatus({ type: 'success', message: "Your message has been sent successfully!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: "Failed to send message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full bg-transparent py-24 relative z-10 overflow-x-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12"
        >
          {/* Left Column: Info & Details */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-10">
            
            {/* Header Area */}
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm mb-6">
                <span className="w-1.5 h-1.5 bg-black dark:bg-white" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 dark:text-gray-300">Let's Connect</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black dark:text-white leading-[1.1] tracking-tighter mb-6">
                Have a Project<br />in Mind?
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                I'm always excited to work on new ideas, collaborate with amazing people, and bring creative visions to life. Drop me a message and I'll get back to you as soon as possible.
              </p>
            </div>

            {/* Vertical Contact Cards */}
            <div className="flex flex-col gap-4 mt-2">
              <a href={`mailto:${hero?.email || "hello@salmanhossain.com"}`} className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-1">Email</h4>
                  <p className="text-lg font-bold text-black dark:text-white">{hero?.email || "hello@salmanhossain.com"}</p>
                </div>
              </a>

              <a href={`tel:${hero?.phone || "+8801234567890"}`} className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-1">Phone</h4>
                  <p className="text-lg font-bold text-black dark:text-white">{hero?.phone || "+880 1234-567890"}</p>
                </div>
              </a>

              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 flex items-center gap-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-1">Location</h4>
                  <p className="text-lg font-bold text-black dark:text-white">{hero?.location || "Dhaka, Bangladesh"}</p>
                </div>
              </div>
            </div>



          </motion.div>

          {/* Right Column: Form Container */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="bg-black/5 dark:bg-white/[0.03] backdrop-blur-xl border border-black/10 dark:border-white/10 p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full relative overflow-hidden group/form">
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/10 dark:border-white/10">
                  <Send className="w-5 h-5 text-black dark:text-white" />
                  <h3 className="text-xl font-bold text-black dark:text-white">Send Me a Message</h3>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  
                  {submitStatus.type === 'success' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  )}

                  {submitStatus.type === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 flex items-center gap-2">
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Your Name" 
                      className="px-6 py-4 bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-none w-full disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Your Email" 
                      className="px-6 py-4 bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-none w-full disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      id="subject" 
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Subject" 
                      className="px-6 py-4 bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-none w-full disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <textarea 
                      id="message" 
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Your Message..." 
                      className="px-6 py-4 bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-all resize-none placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-none w-full disabled:opacity-50"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden px-8 py-5 mt-4 bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center border border-black/20 dark:border-white/20 transition-all duration-500 w-full disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {!isSubmitting && <span className="absolute inset-y-0 left-0 w-0 bg-gray-800 dark:bg-black transition-all duration-500 ease-out group-hover:w-full z-0" />}
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500 tracking-wide uppercase text-sm">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>

                </form>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
