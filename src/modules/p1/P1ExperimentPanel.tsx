import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import P1InputForm from './P1InputForm';
import P1ResultsPanel from './P1ResultsPanel';
import { Experiment } from '../../types/experiment.types';
import { apiClient } from '../../api/client';
import { useQuery } from '@tanstack/react-query';
import ProgressBar from '../../components/common/ProgressBar';
import { AlertCircle } from 'lucide-react';

const P1ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');

  // Fetch experiment details if ID exists
  const { data: experiment } = useQuery({
    queryKey: ['experiment', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      const response = await apiClient.get(`/experiments/${id}`);
      return response.data as Experiment;
    },
    enabled: !!id && id !== 'new',
  });

  const handleRunExperiment = async (formData: any) => {
    setIsRunning(true);
    setProgress(0);
    setStage('Initializing models...');

    try {
      // 1. Submit the experiment
      await apiClient.post('/p1/predict-age', formData);

      // 2. Simulate polling (architecture specifies MSW delay)
      // In a real app, this would be a useEffect polling /api/p1/jobs/:jobId/status
      simulatePolling();
    } catch (error) {
      console.error('Experiment failed:', error);
      setIsRunning(false);
    }
  };

  const simulatePolling = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsRunning(false);
        setStage('Complete');
        // In a real app, we would refetch the experiment results here
      } else if (currentProgress > 70) {
        setStage('Finalizing results...');
      } else if (currentProgress > 40) {
        setStage('Computing gene importance...');
      } else {
        setStage('Running inference...');
      }
      setProgress(currentProgress);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Left Input Panel */}
      <div className="w-[400px] flex-shrink-0 overflow-y-auto rounded-xl border bg-white shadow-sm">
        <P1InputForm onRun={handleRunExperiment} isRunning={isRunning} />
      </div>

      {/* Right Results Panel */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-slate-50 shadow-sm relative">
        {isRunning ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="mb-8 h-24 w-24 animate-spin rounded-full border-b-4 border-t-4 border-scientific-blue" />
            <h2 className="text-2xl font-bold text-slate-900">Processing Biological Data</h2>
            <p className="mt-2 text-slate-500 max-w-md">
              Our AI models are analyzing your multi-omics data to predict biological age and disease risk factors.
            </p>
            <div className="mt-12 w-full max-w-md">
              <ProgressBar progress={progress} stage={stage} />
            </div>
          </div>
        ) : progress === 100 || (experiment && experiment.status === 'complete') ? (
          <P1ResultsPanel experimentId={id || 'mock-id'} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-slate-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No Experiment Data</p>
            <p className="text-sm">Configure parameters on the left and click "Run Prediction" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default P1ExperimentPanel;
