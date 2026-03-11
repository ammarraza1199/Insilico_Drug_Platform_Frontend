import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import P2InputForm from './P2InputForm';
import P2ResultsPanel from './P2ResultsPanel';
import { apiClient } from '../../api/client';
import { useModelStore } from '../../stores/modelStore';
import ProgressBar from '../../components/common/ProgressBar';
import { Terminal, Database, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/formatters';

const P2ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEffectiveConfig } = useModelStore();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunGeneration = async (formData: any) => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setLogs([]);
    addLog('Initializing synthetic data engine...');
    setStage('Initializing...');

    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 15, 85);
        if (next === 30) addLog('Loading reference distributions...');
        if (next === 60) addLog('Synthesizing gene correlations...');
        return next;
      });
      setStage('Generating data...');
    }, 2000);

    try {
      const config = getEffectiveConfig('p2');
      const payload = {
        experiment_name: formData.experimentName,
        project_id: formData.projectId,
        tissue_type: formData.tissueType,
        species: formData.species.map((s: string) => s.toLowerCase()),
        age_range: { min: formData.ageMin, max: formData.ageMax },
        biological_condition: formData.biologicalCondition === 'Disease State' ? 'disease' : formData.biologicalCondition.toLowerCase().replace(' ', '_'),
        disease_state: formData.diseaseState || null,
        data_modalities: formData.modalities.map((m: string) => m.toLowerCase().replace('-', '_')),
        number_of_samples: formData.numberOfSamples,
        noise_level: formData.noiseLevel.toLowerCase(),
        batch_effect_simulation: formData.batchEffectSimulation || false,
        preserve_correlation_structure: formData.preserveCorrelationStructure || false,
        seed: formData.seed || null,
        llm_config: { 
          model_name: config.modelName,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }
      };

      const response = await apiClient.post('/p2/generate-data', payload);
      clearInterval(interval);
      setProgress(100);
      setStage('Generation Complete');
      addLog('Generation complete. Manifest ready.');
      
      const newId = response.data.experiment_id;
      if (newId) {
        setTimeout(() => {
          setIsRunning(false);
          navigate(`/experiment/p2/${newId}`);
        }, 1000);
      }
    } catch (err: any) {
      addLog('ERROR: Failed to connect to generation worker.');
      clearInterval(interval);
      setIsRunning(false);
      setStage('Failed');
      setError(err.message || 'Generation failed.');
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Left Input Panel */}
      <div className="w-[400px] flex-shrink-0 overflow-y-auto rounded-xl border bg-white shadow-sm">
        <P2InputForm onRun={handleRunGeneration} isRunning={isRunning} />
      </div>

      {/* Right Results/Generation Panel */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-slate-50 shadow-sm relative">
        {isRunning ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top half: Skeleton matrix */}
            <div className="flex-1 p-8 bg-white overflow-hidden">
               <h3 className="text-slate-400 font-bold mb-6 uppercase text-xs tracking-wider">Generating Multi-Omics Dataset...</h3>
               <div className="grid grid-cols-8 gap-3 mb-4 opacity-50">
                 {Array.from({ length: 96 }).map((_, i) => (
                   <div key={i} className="h-4 bg-slate-300 rounded animate-pulse" style={{ animationDelay: `${(i % 8) * 0.05}s` }}></div>
                 ))}
               </div>
            </div>

            {/* Bottom half: Terminal output */}
            <div className="h-[280px] flex flex-col bg-slate-900 text-slate-300 font-mono text-xs overflow-hidden shadow-inner border-t-4 border-scientific-teal">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Terminal size={14} className="text-scientific-teal" />
                  <span className="font-bold text-slate-400">P2 Generation Worker — Status: Running</span>
                </div>
                <div className="flex space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-scientific-teal animate-pulse" />
                </div>
              </div>

              {/* Log Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={cn(
                    "opacity-0 animate-fade-in",
                    log.includes('ERROR') ? "text-scientific-red" : "text-scientific-teal"
                  )}>
                    {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>

              {/* Progress Footer */}
              <div className="border-t border-slate-800 bg-slate-950 p-6">
                <ProgressBar progress={progress} stage={stage} className="text-slate-400" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-scientific-red">
            <AlertCircle size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold">Generation Failed</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : id && id !== 'new' ? (
          <P2ResultsPanel experimentId={id} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-slate-400">
            <Database size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Synthetic Generator Offline</p>
            <p className="text-sm">Configure your multi-omics generation spec on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default P2ExperimentPanel;
