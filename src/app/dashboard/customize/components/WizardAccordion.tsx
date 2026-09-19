"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Save } from "lucide-react";

interface WizardStepProps {
  id: number;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  onNext: () => void;
  isLast?: boolean;
  hideNextButton?: boolean;
}

function WizardStep({ id, title, icon: Icon, children, isExpanded, onToggle, onNext, isLast, hideNextButton }: WizardStepProps) {
  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl mb-4 bg-white dark:bg-[#1A1C23] overflow-hidden shadow-sm transition-all duration-300">
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? 'bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isExpanded ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
            {id}
          </div>
          <Icon className={`w-5 h-5 ${isExpanded ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
          <span className={`font-semibold ${isExpanded ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            {title}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      
      {isExpanded && (
        <div className="p-5 animate-in slide-in-from-top-2 duration-300">
          {children}
          
          {!hideNextButton && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={onNext}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isLast ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Finish
                  </>
                ) : (
                  <>
                    Next Step <ChevronDown className="w-4 h-4 -rotate-90" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WizardAccordion({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}

export { WizardStep };
