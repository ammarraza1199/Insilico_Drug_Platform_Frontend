import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import P3InputForm from './P3InputForm';
import P3ResultsPanel from './P3ResultsPanel';
import { apiClient } from '../../api/client';
import { useModelStore } from '../../stores/modelStore';
import ProgressBar from '../../components/common/ProgressBar';
import { FlaskConical, Search, AlertCircle } from 'lucide-react';

const P3ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEffectiveConfig } = useModelStore();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [screenStats, setScreenStats] = useState({ screened: 0, total: 50000 });

  const handleRunScreen = async (formData: any) => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setScreenStats({ screened: 0, total: 50000 });
    setStage('Loading simulation models...');

    const total = 50000;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 8, 85);
        setScreenStats({ 
          screened: Math.floor((next / 100) * total), 
          total 
        });
        
        if (next > 80) setStage('Ranking top candidates...');
        else if (next > 50) setStage('Computing pathway enrichment...');
        else if (next > 20) setStage('Simulating perturbations...');
        else setStage('Processing gene targets...');
        return next;
      });
    }, 800);

    try {
      const config = getEffectiveConfig('p3');
      const payload = {
        experiment_name: formData.experimentName,
        project_id: formData.projectId,
        tissue_type: formData.tissueType,
        disease_condition: formData.diseaseCondition,
        age_range: { min: formData.ageMin, max: formData.ageMax },
        gene_targets: formData.geneTargets.map((g: any) => ({
          gene: g.gene,
          expression_level: g.expressionLevel,
          direction: g.direction
        })),
        screening_mode: formData.screeningMode,
        max_compounds: formData.maxCompounds,
        pathway_focus: formData.pathwayFocus ? formData.pathwayFocus.split(',').map((p: string) => p.trim()) : [],
        filter_toxicity: formData.filterToxicity,
        llm_config: { 
          model_name: config.modelName,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }
      };

      const response = await apiClient.post('/p3/drug-screen', payload);
      clearInterval(interval);
      setProgress(100);
      setScreenStats({ screened: total, total });
      setStage('Screen Complete');
      
      const newId = response.data.experiment_id;
      if (newId) {
        setTimeout(() => {
          setIsRunning(false);
          navigate(`/experiment/p3/${newId}`);
        }, 1000);
      }
    } catch (err: any) {
      console.error('Drug screen failed:', err);
      clearInterval(interval);
      setIsRunning(false);
      setStage('Failed');
      setError(err.message || 'Drug screen failed.');
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Left Input Panel */}
      <div className="w-[400px] flex-shrink-0 overflow-y-auto rounded-xl border bg-white shadow-sm">
        <P3InputForm onRun={handleRunScreen} isRunning={isRunning} />
      </div>

      {/* Right Results Panel */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-slate-50 shadow-sm relative">
        {isRunning ? (
          <div className="flex flex-col h-full p-8 bg-slate-50 overflow-hidden">
            <h3 className="text-slate-400 font-bold mb-6 uppercase text-xs tracking-wider">Simulating Drug Perturbations...</h3>
            
            <div className="flex space-x-6 mb-8 flex-1">
              <div className="flex-1 bg-white border rounded-xl p-8 shadow-sm flex flex-col animate-pulse">
                 <div className="h-6 w-3/4 bg-slate-200 rounded mb-6"></div>
                 <div className="space-y-4 mb-auto">
                   <div className="h-4 w-full bg-slate-200 rounded"></div>
                   <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                   <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
                 </div>
                 <div className="mt-8 h-40 w-40 rounded-full border-8 border-slate-100 mx-auto flex items-center justify-center">
                   <FlaskConical size={48} className="text-slate-200" />
                 </div>
              </div>
              
              <div className="flex-1 bg-white border rounded-xl p-8 shadow-sm animate-pulse" style={{ animationDelay: '0.2s' }}>
                 <div className="h-6 w-1/2 bg-slate-200 rounded mb-8"></div>
                 <div className="space-y-6">
                   {Array.from({length: 6}).map((_,i) => (
                     <div key={i} className="flex space-x-4 items-center">
                       <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
                       <div className="h-4 flex-1 bg-slate-200 rounded"></div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl border-t-4 border-scientific-purple shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm font-bold text-slate-700">
                  <Search size={16} className="mr-2 text-scientific-purple animate-pulse" />
                  Compounds Screened (In Silico)
                </div>
                <div className="text-xl font-mono font-black text-scientific-purple">
                  {screenStats.screened.toLocaleString()} <span className="text-sm font-medium text-slate-400">/ {screenStats.total.toLocaleString()}</span>
                </div>
              </div>
              <ProgressBar progress={progress} stage={stage} className="text-scientific-purple" />
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-scientific-red">
            <AlertCircle size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold">Screening Failed</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : id && id !== 'new' ? (
          <P3ResultsPanel experimentId={id} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-slate-400">
            <FlaskConical size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Drug Discovery Engine Offline</p>
            <p className="text-sm">Define your biological targets and screening mode to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default P3ExperimentPanel;
