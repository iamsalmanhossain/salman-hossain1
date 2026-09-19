"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blog.service";

export default function Blog() {
  const { data: blogsData } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => BlogService.getBlogs(),
  });

  const posts = blogsData?.data || [];

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
    <section id="blog" className="w-full bg-transparent py-20 relative z-10 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
              Recent Articles
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
          </div>
          <a href="#" className="flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors group">
            View All Posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              variants={itemVariants}
              className="bg-white/60 dark:bg-[#1A1C23]/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full">
                  Blog
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5 min read</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {post.content.substring(0, 100)}...
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
