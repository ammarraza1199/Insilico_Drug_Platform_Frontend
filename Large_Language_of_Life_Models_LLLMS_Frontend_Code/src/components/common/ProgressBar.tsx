import React from 'react';
import { cn } from '../../utils/formatters';

interface ProgressBarProps {
  progress: number;
  stage?: string;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  stage, 
  className,
  showPercentage = true 
}) => {
  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-slate-600">{stage || "Processing..."}</span>
        {showPercentage && <span className="text-scientific-blue">{Math.round(progress)}%</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div 
          className="h-full bg-scientific-blue transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
