import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import P3InputForm from './P3InputForm';
import P3ResultsPanel from './P3ResultsPanel';
import { apiClient } from '../../api/client';
import ProgressBar from '../../components/common/ProgressBar';
import { FlaskConical, Search } from 'lucide-react';

const P3ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [screenStats, setScreenStats] = useState({ screened: 0, total: 50000 });

  const handleRunScreen = async (formData: any) => {
    setIsRunning(true);
    setProgress(0);
    setScreenStats({ screened: 0, total: 50000 });
    setStage('Loading simulation models...');

    try {
      await apiClient.post('/p3/screen-compounds', formData);
      simulateScreening();
    } catch (error) {
      console.error('Drug screen failed:', error);
      setIsRunning(false);
    }
  };

  const simulateScreening = () => {
    let currentProgress = 0;
    const total = 50000;
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setScreenStats({ screened: total, total });
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), 1000);
      } else {
        setScreenStats({ 
          screened: Math.floor((currentProgress / 100) * total), 
          total 
        });
        
        if (currentProgress > 80) setStage('Ranking top candidates...');
        else if (currentProgress > 50) setStage('Computing pathway enrichment...');
        else if (currentProgress > 20) setStage('Simulating perturbations...');
        else setStage('Processing gene targets...');
      }
      setProgress(currentProgress);
    }, 800);
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
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8">
              <div className="h-32 w-32 animate-spin-slow rounded-full border-b-4 border-t-4 border-scientific-purple opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FlaskConical size={48} className="text-scientific-purple animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900">Digital Drug Perturbation Screen</h2>
            <p className="mt-2 text-slate-500 max-w-md">
              Screening compound libraries against your target gene expression signatures.
            </p>

            <div className="mt-12 w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm font-bold text-slate-700">
                  <Search size={16} className="mr-2 text-scientific-purple" />
                  Compounds Screened
                </div>
                <div className="text-lg font-mono font-black text-scientific-purple">
                  {screenStats.screened.toLocaleString()} / {screenStats.total.toLocaleString()}
                </div>
              </div>
              <ProgressBar progress={progress} stage={stage} className="text-scientific-purple" />
            </div>
          </div>
        ) : progress === 100 || id !== 'new' ? (
          <P3ResultsPanel experimentId={id || 'mock-p3'} />
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
