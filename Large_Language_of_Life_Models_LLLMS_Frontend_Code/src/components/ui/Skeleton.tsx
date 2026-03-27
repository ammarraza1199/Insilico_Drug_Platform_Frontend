import React from 'react';
import { cn } from '../../utils/formatters';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-slate-200/60", 
        className
      )} 
    />
  );
};

export default Skeleton;
