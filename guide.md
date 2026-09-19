# মাল্টি-টেমপ্লেট ডেভেলপমেন্ট গাইড

আপনার পোর্টফোলিও সিস্টেমে এখন একাধিক হোমপেজ টেমপ্লেট ডায়নামিকভাবে সাপোর্ট করে। এই গাইডে ধাপে ধাপে দেখানো হয়েছে কীভাবে আপনি ভবিষ্যতে নতুন কোনো ডিজাইন (টেমপ্লেট) অ্যাড করবেন এবং ব্যাকএন্ড থেকে ডাটা আনবেন।

---

## ১. নতুন টেমপ্লেট তৈরি করা

আপনার ফ্রন্টএন্ড ফোল্ডারে `src/templates/` নামে একটি ফোল্ডার রয়েছে। এখানেই আপনার সব টেমপ্লেটের কোড থাকবে।
প্রতিটি টেমপ্লেটের জন্য একটি আলাদা ফোল্ডার তৈরি করুন, যাতে ওই টেমপ্লেটের নিজস্ব কম্পোনেন্টগুলো সেখানে সুন্দর করে সাজানো থাকে।

ধরুন আপনি **"Minimalist Theme"** নামে একটি নতুন টেমপ্লেট বানাতে চান। 

প্রথমে `src/templates/` ফোল্ডারে `MinimalistTheme` নামে একটি ফোল্ডার তৈরি করুন এবং সেখানে `MinimalistTheme.tsx` তৈরি করুন:

```tsx
import React from 'react';
// এখানে আপনার প্রয়োজনীয় আইকন, ছবি বা কম্পোনেন্ট ইম্পোর্ট করবেন
// যেমন: import Hero from "./components/Hero";

export default function MinimalistTheme({ websiteData, activeTemplate, isLight }: any) {
  
  // websiteData এর ভেতর থেকে আপনি ডাটা পাবেন:
  const { showHero, showAbout, showProjects } = websiteData || {};

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {showHero !== false && (
        <section className="p-20 text-center">
          <h1 className="text-5xl font-bold">Hello, I am Salman</h1>
          <p className="mt-4 text-gray-600">This is my minimalist portfolio.</p>
        </section>
      )}

      {/* আপনার নতুন ডিজাইনের অন্যান্য সেকশনগুলো এখানে অ্যাড করবেন */}

    </div>
  );
}
```

> **নোট:** `websiteData`, `activeTemplate` এবং `isLight` এই প্রপসগুলো স্বয়ংক্রিয়ভাবে `page.tsx` থেকে আপনার টেমপ্লেটে পাঠানো হবে।

---

## ২. টেমপ্লেটটিকে রেজিস্ট্রি (Registry) তে যুক্ত করা

নতুন ফাইলটি তৈরি করার পর, আপনার সিস্টেমকে জানাতে হবে যে এই নামে একটি টেমপ্লেট আছে। 

এর জন্য `src/templates/TemplateRegistry.tsx` ফাইলটি ওপেন করুন এবং নিচের মতো করে আপনার নতুন টেমপ্লেটটি ইম্পোর্ট করে ম্যাপ করে দিন:

```tsx
import TechDarkTheme from "./TechDarkTheme/TechDarkTheme";
import MinimalistTheme from "./MinimalistTheme/MinimalistTheme"; // ১. ইম্পোর্ট করুন

export const TemplateRegistry: Record<string, React.FC<any>> = {
  "Tech Dark Theme": TechDarkTheme,
  "Minimalist Theme": MinimalistTheme, // ২. ম্যাপ করুন
};
```

> **জরুরি সতর্কতা:** এখানে বাম পাশের নামটা (`"Minimalist Theme"`) ঠিক হুবহু সেই নামটাই হতে হবে, যে নামে আপনি ব্যাকএন্ড বা ডাটাবেজে (অ্যাডমিন প্যানেল থেকে) টেমপ্লেটটি সেভ করবেন। 

---

## ৩. ব্যাকএন্ড থেকে অন্যান্য ডাটা (Projects, Skills, Blogs) ফেচ করা

আপনি যদি আপনার নতুন টেমপ্লেটের ভেতরে ইউজারের প্রোজেক্ট বা ব্লগ দেখাতে চান, তাহলে আপনি সরাসরি কাস্টম হুক ব্যবহার করতে পারেন। 

যেহেতু আমাদের প্রোজেক্টে `React Query` সেটআপ করা আছে, আপনি সরাসরি সার্ভিস কল করে ডাটা আনতে পারেন। নিচে উদাহরণ দেওয়া হলো:

```tsx
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export default function MinimalistTheme({ websiteData }: any) {
  
  // ব্যাকএন্ড থেকে প্রোজেক্ট ফেচ করা
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => ProjectService.getProjects(),
  });

  const projects = projectsData?.data || [];

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold">My Projects</h2>
      
      {isLoading ? <p>Loading...</p> : (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {projects.map((project: any) => (
            <div key={project.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

এই হুকগুলো আপনি যেকোনো টেমপ্লেট ফাইলে ব্যবহার করতে পারবেন:
- **Projects:** `ProjectService.getProjects()`
- **Blogs:** `BlogService.getBlogs()`
- **Experiences:** `ExperienceService.getExperiences()`
- **Skills/Hero:** `HeroSectionService.getHeroSection()`

---

## ৪. অ্যাডমিন প্যানেল থেকে টেমপ্লেট সিলেক্ট করা

সিস্টেমটি এখন সম্পূর্ণ ডায়নামিক! 
আপনি যদি অ্যাডমিন প্যানেল থেকে একটি নতুন টেমপ্লেট এন্ট্রি তৈরি করেন, যার `templateName` হলো `"Minimalist Theme"`, এবং সেটিকে `isActive: true` করে দেন, তাহলে আপনার ওয়েবসাইটের হোমপেজ সাথে সাথে `MinimalistTheme.tsx` এর ডিজাইনটি রেন্ডার করা শুরু করবে!

কোনো কোড পরিবর্তন ছাড়াই শুধুমাত্র অ্যাডমিন প্যানেল থেকে ক্লিক করে আপনি পুরো ওয়েবসাইটের ডিজাইন বদলে ফেলতে পারবেন।
