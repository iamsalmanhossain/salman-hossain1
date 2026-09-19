"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { VisitorAnalyticsService } from "@/services/visitorAnalytics.service";

export default function VisitorTracker() {
  const pathname = usePathname();
  const trackedPages = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only track once per page load to avoid duplicate counts in React strict mode or rapid navigation
    if (pathname && !trackedPages.current.has(pathname)) {
      trackedPages.current.add(pathname);
      VisitorAnalyticsService.trackVisit(pathname);
    }
  }, [pathname]);

  return null;
}
