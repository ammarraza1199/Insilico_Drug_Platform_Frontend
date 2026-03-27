import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface ApiKeyFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "sk-...",
  error 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-scientific-blue">
          <ShieldCheck size={12} className="mr-1" />
          Securely Handled
        </div>
      </div>
      
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "block w-full rounded-md border px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-1",
            error ? "border-scientific-red ring-scientific-red" : "border-slate-300 focus:border-scientific-blue focus:ring-scientific-blue"
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      {error && <p className="text-xs text-scientific-red">{error}</p>}
      <p className="text-[10px] text-slate-400 italic">Keys are held in memory for this session only and never persisted to local storage.</p>
    </div>
  );
};

export default ApiKeyField;
