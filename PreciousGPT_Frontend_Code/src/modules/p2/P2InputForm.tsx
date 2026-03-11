import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database, ChevronDown } from 'lucide-react';
import ModelSelectorWidget from '../../components/model/ModelSelectorWidget';

const p2Schema = z.object({
  experimentName: z.string().min(3, 'Experiment name is required'),
  projectId: z.string().min(1, 'Project selection is required'),
  tissueType: z.string().min(1, 'Tissue type is required'),
  species: z.array(z.string()).min(1, 'At least one species is required'),
  ageMin: z.number().min(0).max(120),
  ageMax: z.number().min(0).max(120),
  biologicalCondition: z.string().min(1, 'Condition is required'),
  diseaseState: z.string().optional(),
  modalities: z.array(z.string()).min(1, 'At least one modality is required'),
  numberOfSamples: z.number().min(10).max(10000),
  referenceDataset: z.string(),
  noiseLevel: z.string(),
  batchEffectSimulation: z.boolean().optional(),
  preserveCorrelationStructure: z.boolean().optional(),
  seed: z.number().optional(),
});

type P2Form = z.infer<typeof p2Schema>;

interface P2InputFormProps {
  onRun: (data: P2Form) => void;
  isRunning: boolean;
}

const P2InputForm: React.FC<P2InputFormProps> = ({ onRun, isRunning }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<P2Form>({
    resolver: zodResolver(p2Schema),
    defaultValues: {
      experimentName: 'Synthetic Liver Data Run',
      projectId: 'proj-1',
      tissueType: 'Liver',
      biologicalCondition: 'Healthy',
      species: ['Human'],
      modalities: ['RNA-seq'],
      ageMin: 20,
      ageMax: 80,
      numberOfSamples: 500,
      referenceDataset: 'GTEx',
      noiseLevel: 'Medium',
      batchEffectSimulation: true,
      preserveCorrelationStructure: true,
    }
  });

  const ageMin = watch('ageMin');
  const ageMax = watch('ageMax');
  const numSamples = watch('numberOfSamples');

  return (
    <form onSubmit={handleSubmit(onRun)} className="flex flex-col h-full">
      <div className="border-b bg-slate-50 p-6">
        <h3 className="text-lg font-bold text-slate-900 text-scientific-teal">Configure WallahGPT2</h3>
        <p className="text-xs text-slate-500">Synthetic Multi-Omics Data Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Experiment Metadata */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Metadata</h4>
          <div>
            <label className="text-sm font-medium text-slate-700">Experiment Name</label>
            <input 
              {...register('experimentName')}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-scientific-teal focus:outline-none focus:ring-1 focus:ring-scientific-teal"
              placeholder="e.g., Synthetic Liver Cohort"
            />
            {errors.experimentName && <p className="mt-1 text-xs text-scientific-red font-bold">{errors.experimentName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Project Selection</label>
            <select {...register('projectId')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="proj-1">Aging Study 2024</option>
              <option value="proj-2">Synthetic Lung Data</option>
            </select>
            {errors.projectId && <p className="mt-1 text-xs text-scientific-red font-bold">{errors.projectId.message}</p>}
          </div>
        </section>

        {/* Generation Parameters */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Generation Parameters</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Tissue Type</label>
              <select {...register('tissueType')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Liver">Liver</option>
                <option value="Brain">Brain</option>
                <option value="Blood">Blood</option>
                <option value="Lung">Lung</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Biological Condition</label>
              <select {...register('biologicalCondition')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Healthy">Healthy</option>
                <option value="Disease State">Disease State</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Disease State (if applicable)</label>
              <input 
                {...register('diseaseState')}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-scientific-teal focus:outline-none"
                placeholder="e.g., Alzheimer's"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Age Range (Years)</label>
              <span className="text-xs font-bold text-scientific-teal">{ageMin} – {ageMax}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min="0" max="120" {...register('ageMin', { valueAsNumber: true })} className="accent-scientific-teal" />
              <input type="range" min="0" max="120" {...register('ageMax', { valueAsNumber: true })} className="accent-scientific-teal" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Number of Samples</label>
              <span className="text-xs font-bold text-scientific-teal">{numSamples}</span>
            </div>
            <input type="range" min="10" max="2000" step="10" {...register('numberOfSamples', { valueAsNumber: true })} className="w-full accent-scientific-teal" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Data Modalities</label>
            <div className="grid grid-cols-2 gap-2">
              {['RNA-seq', 'Methylation', 'Proteomics', 'Metabolomics'].map(m => (
                <label key={m} className="flex items-center space-x-2 text-xs text-slate-600 border rounded p-2 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" value={m} {...register('modalities')} className="rounded text-scientific-teal focus:ring-scientific-teal" />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Model Widget */}
        <ModelSelectorWidget system="p2" />

        {/* Advanced Section */}
        <details className="group border rounded-lg overflow-hidden transition-all">
          <summary className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
            Advanced Configuration
            <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
          </summary>
          <div className="p-4 space-y-4 border-t bg-white">
             <div>
              <label className="text-sm font-medium text-slate-700">Reference Dataset</label>
              <select {...register('referenceDataset')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="GTEx">GTEx v8</option>
                <option value="GEO">NCBI GEO</option>
                <option value="ENCODE">ENCODE Project</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Noise Level</label>
              <select {...register('noiseLevel')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Low">Low (Highest Fidelity)</option>
                <option value="Medium">Medium</option>
                <option value="High">High (High Diversity)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Random Seed</label>
              <input type="number" {...register('seed', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Random" />
            </div>
            <div className="space-y-2 mt-2 pt-2 border-t">
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input type="checkbox" {...register('batchEffectSimulation')} className="rounded text-scientific-teal focus:ring-scientific-teal" />
                <span>Simulate Batch Effects</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input type="checkbox" {...register('preserveCorrelationStructure')} className="rounded text-scientific-teal focus:ring-scientific-teal" />
                <span>Preserve Correlation Structure</span>
              </label>
            </div>
          </div>
        </details>
      </div>

      <div className="border-t bg-slate-50 p-6 space-y-3">
        <button
          type="submit"
          disabled={isRunning}
          className="flex w-full items-center justify-center rounded-md bg-scientific-teal px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-teal-600 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <Database size={18} className="mr-2" />
          {isRunning ? "Generating Data..." : "Generate Dataset"}
        </button>
      </div>
    </form>
  );
};

export default P2InputForm;
