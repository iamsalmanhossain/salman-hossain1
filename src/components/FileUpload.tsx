"use client";

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, File as FileIcon, Loader2, Image as ImageIcon } from 'lucide-react';
import { UploadService } from '@/services/upload.service';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  className?: string;
  isPdf?: boolean;
}

export default function FileUpload({ 
  value, 
  onChange, 
  accept = "image/*", 
  label = "Upload File", 
  className = "",
  isPdf = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      if (accept.includes('image') && !file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      if (accept.includes('pdf') && file.type !== 'application/pdf') {
        throw new Error('Please select a PDF file');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size should not exceed 10MB');
      }

      const response = await UploadService.uploadFile(file);
      
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        onChange(response.data[0].url);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Previews
  const isImageValue = value && !value.endsWith('.pdf') && !isPdf;
  const isPdfValue = value && (value.endsWith('.pdf') || isPdf);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      
      <div 
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] overflow-hidden group cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
            : 'border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-black/20 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-gray-100 dark:hover:bg-black/40'
          }
          ${error ? 'border-red-500' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileInputChange} 
          accept={accept} 
          className="hidden" 
        />

        {isUploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
          </div>
        )}

        {value ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {isImageValue ? (
              <img 
                src={value} 
                alt="Uploaded file preview" 
                className="max-h-[140px] w-auto object-contain rounded-lg shadow-sm"
              />
            ) : isPdfValue ? (
              <div className="flex flex-col items-center text-red-500">
                <FileIcon className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium truncate max-w-[200px]" title={value}>
                  PDF Document Uploaded
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-blue-500">
                <FileIcon className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium truncate max-w-[200px]" title={value}>
                  File Uploaded
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
              <button 
                onClick={handleRemove}
                type="button"
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform transform hover:scale-110 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-500">
               {accept.includes('image') ? <ImageIcon className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
            </div>
            <p className="text-sm font-medium text-center">
              <span className="text-blue-500 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {accept === "image/*" ? "SVG, PNG, JPG or GIF (max. 10MB)" : "PDF or Document (max. 10MB)"}
            </p>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      
      {/* Hidden input to bind with react-hook-form */}
      <input type="hidden" value={value || ''} />
    </div>
  );
}
