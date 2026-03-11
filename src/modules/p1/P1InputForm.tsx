import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play, Save, History } from 'lucide-react';
import FileUploadZone from '../../components/common/FileUploadZone';
import ModelSelectorWidget from '../../components/model/ModelSelectorWidget';

const p1Schema = z.object({
  experimentName: z.string().min(3, 'Experiment name is required'),
  projectId: z.string().min(1, 'Project selection is required'),
  tissueType: z.string().min(1, 'Tissue type is required'),
  species: z.string().min(1, 'Species is required'),
  chronologicalAge: z.number().min(0).max(120),
  sex: z.enum(['Male', 'Female', 'Unknown']),
  preprocessingOptions: z.array(z.string()),
  methylationFileId: z.string().min(1, 'DNA methylation data is required'),
  rnaSeqFileId: z.string().optional(),
});

type P1Form = z.infer<typeof p1Schema>;

interface P1InputFormProps {
  onRun: (data: P1Form) => void;
  isRunning: boolean;
}

const P1InputForm: React.FC<P1InputFormProps> = ({ onRun, isRunning }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<P1Form>({
    resolver: zodResolver(p1Schema),
    defaultValues: {
      sex: 'Unknown',
      preprocessingOptions: ['Normalize'],
      chronologicalAge: 62,
    }
  });

  const tissueOptions = ['Blood', 'Brain', 'Liver', 'Lung', 'Heart', 'Kidney', 'Muscle', 'Adipose', 'Skin', 'Pancreas', 'Other'];
  const speciesOptions = ['Human', 'Mouse', 'Rat', 'Zebrafish', 'Other'];

  return (
    <form onSubmit={handleSubmit(onRun)} className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-slate-50 p-6">
        <h3 className="text-lg font-bold text-slate-900">Configure P1 Experiment</h3>
        <p className="text-xs text-slate-500">Predict biological age and clinical insights</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Experiment Metadata */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Metadata</h4>
          <div>
            <label className="text-sm font-medium text-slate-700">Experiment Name</label>
            <input 
              {...register('experimentName')}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-scientific-blue focus:outline-none focus:ring-1 focus:ring-scientific-blue"
              placeholder="e.g., Baseline Aging Clock"
            />
            {errors.experimentName && <p className="mt-1 text-xs text-scientific-red">{errors.experimentName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Project Assignment</label>
            <select 
              {...register('projectId')}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-scientific-blue focus:outline-none"
            >
              <option value="proj-1">Aging Study 2024</option>
              <option value="proj-2">Synthetic Lung Data</option>
            </select>
          </div>
        </section>

        {/* Data Upload */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Upload</h4>
          <FileUploadZone 
            label="DNA Methylation (CSV/TSV)" 
            onFileSelect={(file) => setValue('methylationFileId', file ? 'mock-id' : '')} 
            helperText="Upload CpG site methylation values"
          />
          <FileUploadZone 
            label="RNA-seq Gene Expression (Optional)" 
            onFileSelect={(file) => setValue('rnaSeqFileId', file ? 'mock-id' : '')} 
          />
        </section>

        {/* Biological Parameters */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Biological Parameters</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Tissue Type</label>
              <select {...register('tissueType')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {tissueOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Species</label>
              <select {...register('species')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {speciesOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Chronological Age</label>
              <input 
                {...register('chronologicalAge', { valueAsNumber: true })}
                type="number" 
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Sex</label>
              <select {...register('sex')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
        </section>

        {/* AI Model Config */}
        <ModelSelectorWidget system="p1" />

        {/* Advanced Options */}
        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preprocessing</h4>
          {['Normalize', 'Filter Low Variance', 'Impute Missing'].map(opt => (
            <label key={opt} className="flex items-center space-x-2 text-sm text-slate-600">
              <input 
                type="checkbox" 
                value={opt}
                {...register('preprocessingOptions')}
                className="h-4 w-4 rounded border-slate-300 text-scientific-blue focus:ring-scientific-blue"
              />
              <span>{opt}</span>
            </label>
          ))}
        </section>
      </div>

      {/* Action Buttons */}
      <div className="border-t bg-slate-50 p-6 space-y-3">
        <button
          type="submit"
          disabled={isRunning}
          className="flex w-full items-center justify-center rounded-md bg-scientific-blue px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <Play size={18} className="mr-2" />
          {isRunning ? "Running Prediction..." : "Run Prediction"}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <Save size={14} className="mr-1.5" /> Save Config
          </button>
          <button type="button" className="flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <History size={14} className="mr-1.5" /> Load Prev
          </button>
        </div>
      </div>
    </form>
  );
};

export default P1InputForm;
