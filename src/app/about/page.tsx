"use client";

import { Suspense } from "react";
import TechDarkAboutTheme from "@/templates/TechDarkTheme/TechDarkAboutTheme";

export default function About() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]" />}>
      <TechDarkAboutTheme />
    </Suspense>
  );
}
