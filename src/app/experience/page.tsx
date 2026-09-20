"use client";

import { Suspense } from "react";
import TechDarkExperienceTheme from "@/templates/TechDarkTheme/TechDarkExperienceTheme";

export default function Experience() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]" />}>
      <TechDarkExperienceTheme />
    </Suspense>
  );
}
