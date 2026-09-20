"use client";

import React from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

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
    <div className={`border rounded-2xl mb-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-white dark:bg-[#1A1A1A] border-blue-200 dark:border-blue-500/30 shadow-md shadow-blue-500/5' : 'bg-white dark:bg-[#151515] border-gray-200 dark:border-white/5 shadow-sm hover:border-gray-300 dark:hover:border-white/10 '}`}>
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors group ${isExpanded ? 'bg-blue-50/50 dark:bg-blue-500/5 border-b border-blue-100 dark:border-blue-500/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${isExpanded ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
            {id}
          </div>
          <Icon className={`w-5 h-5 transition-colors ${isExpanded ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
          <span className={`font-semibold tracking-tight transition-colors ${isExpanded ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
            {title}
          </span>
        </div>
        {isExpanded ? (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
            <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-white/10 flex items-center justify-center transition-colors">
            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </button>
      
      {isExpanded && (
        <div className="p-5 animate-in slide-in-from-top-2 duration-300 bg-white dark:bg-[#1A1A1A] ">
          {children}
          
          {!hideNextButton && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={onNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
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
    <div className="w-full space-y-1">
      {children}
    </div>
  );
}

export { WizardStep };
