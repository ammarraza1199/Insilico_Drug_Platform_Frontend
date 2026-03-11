import React from 'react';
import { CheckCircle2, PlayCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/formatters';
import { ExperimentStatus } from '../../types/experiment.types';

interface StatusBadgeProps {
  status: ExperimentStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = {
    complete: {
      label: 'Complete',
      icon: CheckCircle2,
      colors: 'bg-green-100 text-scientific-green border-green-200',
    },
    running: {
      label: 'Running',
      icon: PlayCircle,
      colors: 'bg-blue-100 text-scientific-blue border-blue-200 animate-pulse-subtle',
    },
    failed: {
      label: 'Failed',
      icon: AlertCircle,
      colors: 'bg-red-100 text-scientific-red border-red-200',
    },
    queued: {
      label: 'Queued',
      icon: Clock,
      colors: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    draft: {
      label: 'Draft',
      icon: Clock,
      colors: 'bg-slate-100 text-slate-500 border-slate-200',
    },
  };

  const { label, icon: Icon, colors } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm",
      colors,
      className
    )}>
      <Icon size={14} className="mr-1.5" />
      {label}
    </span>
  );
};

export default StatusBadge;
