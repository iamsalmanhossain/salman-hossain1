"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

export function ResumeModal({ url, onClose }: { url: string, onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const isCloudinaryPdf = url.includes('cloudinary.com') && url.endsWith('.pdf');
  // By changing .pdf to .png, cloudinary automatically returns the first page of the pdf as an image
  const imageUrl = isCloudinaryPdf ? url.replace('.pdf', '.png') : url;

  const handleWheel = (e: React.WheelEvent) => {
    // Only zoom if ctrl/cmd is pressed to match standard behavior, or just always zoom
    setScale(prev => Math.min(Math.max(0.5, prev - e.deltaY * 0.005), 4));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl h-[95vh] sm:h-[90vh] bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#151515] z-10">
          <h3 className="text-black dark:text-white font-semibold flex items-center gap-2">
            Resume
            <span className="text-gray-600 dark:text-gray-500 text-xs font-normal ml-2 hidden sm:inline-block">Scroll to zoom, drag to move</span>
          </h3>
          <div className="flex items-center gap-3 sm:gap-4">
            {isCloudinaryPdf && (
              <div className="flex items-center gap-1 sm:gap-2 mr-2 bg-black/5 dark:bg-white/5 p-1">
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="cursor-pointer p-1.5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] sm:text-xs font-mono text-gray-600 dark:text-gray-400 w-10 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="cursor-pointer p-1.5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}
            <a href={url} download target="_blank" rel="noreferrer" className="cursor-pointer p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-black dark:text-white" title="Download Original PDF">
              <Download className="w-4 h-4" />
            </a>
            <button onClick={onClose} className="cursor-pointer p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div
          className="flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative flex items-center justify-center bg-gray-200 dark:bg-[#0a0a0a]"
          onWheel={handleWheel}
        >
          {isCloudinaryPdf ? (
            <motion.div
              drag
              dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
              dragElastic={0.1}
              style={{ scale }}
              className="relative w-full max-w-[800px] h-[80%] sm:h-full sm:aspect-[1/1.414] shadow-2xl pointer-events-auto origin-center"
            >
              <Image
                src={imageUrl}
                alt="Resume"
                fill
                className="object-contain pointer-events-none select-none"
                unoptimized
                draggable={false}
              />
            </motion.div>
          ) : (
            <iframe src={`${url}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-0 bg-white" title="Resume" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
