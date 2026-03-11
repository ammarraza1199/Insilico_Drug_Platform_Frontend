import React, { useState } from 'react';
import { 
  Cpu,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import { AISystem } from '../../types/experiment.types';
import { useModelStore } from '../../stores/modelStore';
import ModelSelectorModal from './ModelSelectorModal';

interface ModelSelectorWidgetProps {
  system: AISystem;
}

const ModelSelectorWidget: React.FC<ModelSelectorWidgetProps> = ({ system }) => {
  const { getEffectiveConfig, systemOverrides } = useModelStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const config = getEffectiveConfig(system);
  const isOverridden = !!systemOverrides[system];

  return (
    <div className="rounded-xl border bg-slate-50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-900">
          <Cpu size={18} className="text-scientific-blue" />
          <span>AI Model Configuration</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-xs font-medium text-scientific-blue hover:underline"
        >
          <Edit2 size={12} className="mr-1" />
          Configure
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Provider:</span>
          <span className="font-medium text-slate-900 capitalize">{config.provider.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Model:</span>
          <span className="font-medium text-slate-900">{config.modelName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Temperature:</span>
          <span className="font-medium text-slate-900">{config.temperature}</span>
        </div>
      </div>

      {isOverridden && (
        <div className="mt-3 flex items-center rounded bg-scientific-blue/10 px-2 py-1 text-[10px] font-medium text-scientific-blue">
          <CheckCircle2 size={10} className="mr-1" />
          System-specific override active
        </div>
      )}

      {isModalOpen && (
        <ModelSelectorModal 
          system={system}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ModelSelectorWidget;
