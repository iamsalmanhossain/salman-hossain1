import React from 'react';
import Hero from '../MinimalistTheme/components/Hero';
// এখানে আপনার প্রয়োজনীয় আইকন, ছবি বা কম্পোনেন্ট ইম্পোর্ট করবেন
// যেমন: import Hero from "./components/Hero";

export default function MinimalistTheme({ websiteData, activeTemplate, isLight }: any) {
  
  // websiteData এর ভেতর থেকে আপনি ডাটা পাবেন:
  const { showHero, showAbout, showProjects } = websiteData || {};

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {showHero !== false && (
        <section className="p-20 text-center">
         <Hero />
        </section>
      )}

      {/* আপনার নতুন ডিজাইনের অন্যান্য সেকশনগুলো এখানে অ্যাড করবেন */}

    </div>
  );
}