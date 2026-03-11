import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import P2InputForm from './P2InputForm';
import P2ResultsPanel from './P2ResultsPanel';
import { apiClient } from '../../api/client';
import ProgressBar from '../../components/common/ProgressBar';
import { Terminal, Database } from 'lucide-react';
import { cn } from '../../utils/formatters';

const P2ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
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
    setLogs([]);
    addLog('Initializing synthetic data engine...');
    setStage('Initializing...');

    try {
      // Assuming a setJobId call might have been here, it is now removed.
      await apiClient.post('/p2/generate-data', formData);
      simulateGeneration();
    } catch (error) {
      addLog('ERROR: Failed to connect to generation worker.');
      setIsRunning(false);
    }
  };

  const simulateGeneration = () => {
    const steps = [
      { p: 10, s: 'Loading reference distributions (GTEx)...', l: 'Reference dataset loaded: GTEx v8' },
      { p: 25, s: 'Sampling latent space variables...', l: 'Sampling 500 points from multi-modal latent space' },
      { p: 40, s: 'Applying tissue-specific constraints...', l: 'Applying constraints for: Liver (Healthy)' },
      { p: 60, s: 'Synthesizing gene correlations...', l: 'Preserving 20,531 gene correlation structures' },
      { p: 85, s: 'Injecting batch effects and noise...', l: 'Noise level: Low (VITE_MOCK_NOISE_P2)' },
      { p: 100, s: 'Finalizing dataset manifest...', l: 'Generation complete. Manifest ready for download.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setProgress(step.p);
        setStage(step.s);
        addLog(step.l);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), 1000);
      }
    }, 2000);
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
          <div className="flex flex-col h-full bg-slate-900 text-slate-300 font-mono text-xs overflow-hidden">
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
        ) : progress === 100 || id !== 'new' ? (
          <P2ResultsPanel experimentId={id || 'mock-p2'} />
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
