import React from "react";
import TechDarkTheme from "./TechDarkTheme/TechDarkTheme";
import MinimalistTheme from "./MinimalistTheme/MinimalistTheme";

// টেমপ্লেটের নাম (যেটা ব্যাকএন্ডের AdminPortfolioTemplate টেবিলে 'templateName' হিসেবে থাকবে)
// এবং তার রিঅ্যাক্ট কম্পোনেন্টের ম্যাপিং।
export const TemplateRegistry: Record<string, React.FC<any>> = {
  "Tech Dark Theme": TechDarkTheme,
  // ভবিষ্যতে নতুন টেমপ্লেট যুক্ত করতে এখানে ইম্পোর্ট করে নাম অনুযায়ী ম্যাপ করে দিন
  // "Minimalist Theme": MinimalistTemplate,
  "Minimalist Theme": MinimalistTheme,
};
