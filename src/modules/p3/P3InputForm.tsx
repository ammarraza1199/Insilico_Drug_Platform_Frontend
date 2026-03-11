import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FlaskConical, Trash2 } from 'lucide-react';
import ModelSelectorWidget from '../../components/model/ModelSelectorWidget';

const geneTargetSchema = z.object({
  gene: z.string().min(1, 'Gene name required'),
  expressionLevel: z.number(),
  direction: z.enum(['up', 'down', 'any']),
});

const p3Schema = z.object({
  experimentName: z.string().min(3, 'Experiment name is required'),
  projectId: z.string().min(1),
  tissueType: z.string().min(1),
  diseaseCondition: z.string().min(1),
  ageMin: z.number(),
  ageMax: z.number(),
  geneTargets: z.array(geneTargetSchema).min(1, 'At least one gene target is required'),
  screeningMode: z.enum(['broad', 'targeted', 'lead_optimization']),
  maxCompounds: z.number(),
  pathwayFocus: z.array(z.string()),
  filterToxicity: z.boolean(),
});

type P3Form = z.infer<typeof p3Schema>;

interface P3InputFormProps {
  onRun: (data: P3Form) => void;
  isRunning: boolean;
}

const P3InputForm: React.FC<P3InputFormProps> = ({ onRun, isRunning }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<P3Form>({
    resolver: zodResolver(p3Schema),
    defaultValues: {
      screeningMode: 'broad',
      maxCompounds: 100,
      filterToxicity: true,
      pathwayFocus: ['mTOR'],
      geneTargets: [{ gene: 'MTOR', expressionLevel: -2.0, direction: 'down' }],
      ageMin: 45,
      ageMax: 75,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'geneTargets'
  });

  const ageMin = watch('ageMin');
  const ageMax = watch('ageMax');

  return (
    <form onSubmit={handleSubmit(onRun)} className="flex flex-col h-full">
      <div className="border-b bg-slate-50 p-6">
        <h3 className="text-lg font-bold text-slate-900 text-scientific-purple">Precious3GPT Discovery</h3>
        <p className="text-xs text-slate-500">Digital Drug Perturbation & Screening</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Section 1: Target Biology */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Biology</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Tissue Type</label>
              <select {...register('tissueType')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Brain">Brain (Neurons)</option>
                <option value="Liver">Liver (Hepatocytes)</option>
                <option value="Heart">Heart (Myocytes)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Disease Condition</label>
              <select {...register('diseaseCondition')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="Neurodegeneration">Neurodegeneration</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Aging">Aging / Longevity</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Age Focus</label>
              <span className="text-xs font-bold text-scientific-purple">{ageMin} – {ageMax} y/o</span>
            </div>
            <div className="flex space-x-2">
               <input type="range" min="0" max="120" {...register('ageMin', { valueAsNumber: true })} className="accent-scientific-purple" />
               <input type="range" min="0" max="120" {...register('ageMax', { valueAsNumber: true })} className="accent-scientific-purple" />
            </div>
          </div>
        </section>

        {/* Section 2: Gene Target Editor */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gene Targets</h4>
             <button 
              type="button" 
              onClick={() => append({ gene: '', expressionLevel: 0, direction: 'any' })}
              className="text-[10px] font-bold text-scientific-purple uppercase hover:underline"
            >
              + Add Gene
            </button>
          </div>
          
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 animate-fade-in">
                <input 
                  {...register(`geneTargets.${index}.gene`)} 
                  placeholder="Gene"
                  className="w-24 rounded-md border px-2 py-1.5 text-xs font-bold uppercase"
                />
                <select 
                  {...register(`geneTargets.${index}.direction`)} 
                  className="w-20 rounded-md border px-1 py-1.5 text-xs"
                >
                  <option value="down">Down</option>
                  <option value="up">Up</option>
                  <option value="any">Any</option>
                </select>
                <input 
                  type="number" 
                  step="0.1" 
                  {...register(`geneTargets.${index}.expressionLevel`, { valueAsNumber: true })} 
                  className="w-16 rounded-md border px-1 py-1.5 text-xs"
                />
                <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-scientific-red">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          {errors.geneTargets && <p className="text-[10px] text-scientific-red">{errors.geneTargets.message}</p>}
        </section>

        {/* Section 3: Screening Config */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Screening Configuration</h4>
          <div>
            <label className="text-sm font-medium text-slate-700">Screening Mode</label>
            <select {...register('screeningMode')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="broad">Broad Screen (50k compounds)</option>
              <option value="targeted">Targeted Screen (10k compounds)</option>
              <option value="lead_optimization">Lead Optimization (Analogs)</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-sm text-slate-600">
            <input type="checkbox" {...register('filterToxicity')} className="rounded text-scientific-purple focus:ring-scientific-purple" />
            <span>Apply Toxicity & ADME Filtering</span>
          </label>
        </section>

        <ModelSelectorWidget system="p3" />
      </div>

      <div className="border-t bg-slate-50 p-6">
        <button
          type="submit"
          disabled={isRunning}
          className="flex w-full items-center justify-center rounded-md bg-scientific-purple px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-600 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <FlaskConical size={18} className="mr-2" />
          {isRunning ? "Running Screen..." : "Run Drug Screen"}
        </button>
      </div>
    </form>
  );
};

export default P3InputForm;
