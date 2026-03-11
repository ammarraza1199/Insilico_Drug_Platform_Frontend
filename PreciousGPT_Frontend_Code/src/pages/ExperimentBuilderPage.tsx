import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TestTube2, Database, Cpu, FlaskConical, ChevronRight } from 'lucide-react';
import { cn } from '../utils/formatters';

const ExperimentBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  const systems = [
    {
      id: 'p1',
      name: 'WallahGPT1',
      title: 'Biological Aging Clock',
      description: 'Predict biological age from DNA methylation arrays or RNA-seq gene expression matrices.',
      icon: TestTube2,
      color: 'bg-scientific-blue',
      path: '/experiment/p1/new',
      features: ['Age Acceleration Score', 'SHAP Gene Importance', 'Disease Risk Factors']
    },
    {
      id: 'p2',
      name: 'WallahGPT2',
      title: 'Synthetic Data Generator',
      description: 'Generate high-fidelity synthetic multi-omics datasets indistinguishable from real biological data.',
      icon: Database,
      color: 'bg-scientific-teal',
      path: '/experiment/p2/new',
      features: ['Reference-based Sampling', 'Batch Effect Simulation', 'Custom Tissue Synthesis']
    },
    {
      id: 'p3',
      name: 'WallahGPT3',
      title: 'Drug Discovery Engine',
      description: 'Simulate drug perturbation experiments in silico to identify efficacy against target gene signatures.',
      icon: Cpu,
      color: 'bg-scientific-purple',
      path: '/experiment/p3/new',
      features: ['Candidate Ranking', 'Pathway Analysis', 'Toxicity Filtering']
    }
  ];

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <FlaskConical size={24} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Experiment</h1>
        <p className="mt-2 text-slate-500">Select one of the WallahGPT AI systems to begin your in-silico simulation.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {systems.map((system) => (
          <div 
            key={system.id}
            onClick={() => navigate(system.path)}
            className="group relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 cursor-pointer"
          >
            <div className={cn(
              "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110",
              system.color
            )}>
              <system.icon size={28} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{system.name}</h3>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{system.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">{system.description}</p>
              
              <ul className="space-y-2 mb-8">
                {system.features.map((f, i) => (
                  <li key={i} className="flex items-center text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                    <ChevronRight size={14} className="mr-1 text-slate-300" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button className={cn(
              "flex w-full items-center justify-center rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white transition-colors",
              system.color,
              "opacity-90 hover:opacity-100"
            )}>
              Launch Engine
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-900 p-8 text-white flex items-center justify-between border border-slate-800 shadow-2xl">
        <div className="max-w-xl">
          <h4 className="text-lg font-bold">Cross-System Research Pipeline</h4>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Need to run a complete end-to-end experiment? You can feed P1 age-accelerated targets into P2 for data augmentation, or directly into P3 for therapeutic identification.
          </p>
        </div>
        <button className="rounded-lg bg-white/10 px-6 py-2.5 text-sm font-bold hover:bg-white/20 transition-colors">
          View Pipeline Templates
        </button>
      </div>
    </div>
  );
};

export default ExperimentBuilderPage;
