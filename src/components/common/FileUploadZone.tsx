import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface FileUploadZoneProps {
  label: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  onFileSelect: (file: File | null) => void;
  helperText?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  label, 
  accept, 
  maxSize = 10485760, // 10MB default
  onFileSelect,
  helperText
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const firstError = fileRejections[0]?.errors[0];
      if (firstError?.code === 'file-too-large') {
        setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      } else {
        setError(firstError?.message || 'Invalid file.');
      }
    }
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      
      <div 
        {...getRootProps()} 
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
          isDragActive ? "border-scientific-blue bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50",
          file ? "border-scientific-green bg-green-50" : "",
          error ? "border-scientific-red bg-red-50" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-md bg-scientific-green/10 p-2 text-scientific-green">
                <FileText size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={24} className={cn(
              "mb-2",
              isDragActive ? "text-scientific-blue" : "text-slate-400"
            )} />
            <p className="text-sm font-medium text-slate-900">
              {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
            </p>
            {helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center text-xs text-scientific-red">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </div>
      )}
      
      {file && !error && (
        <div className="flex items-center text-xs text-scientific-green">
          <CheckCircle2 size={12} className="mr-1" />
          File validated and ready.
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
