import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import P1InputForm from './P1InputForm';
import P1ResultsPanel from './P1ResultsPanel';
import { apiClient } from '../../api/client';
import { useModelStore } from '../../stores/modelStore';
import ProgressBar from '../../components/common/ProgressBar';
import { AlertCircle } from 'lucide-react';

const P1ExperimentPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEffectiveConfig } = useModelStore();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleRunExperiment = async (formData: any) => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setStage('Initializing models...');

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 85));
      setStage('Running inference...');
    }, 1000);

    try {
      const config = getEffectiveConfig('p1');
      const payload = {
        experiment_name: formData.experimentName,
        project_id: formData.projectId,
        tissue_type: formData.tissueType,
        species: formData.species.toLowerCase(),
        chronological_age: formData.chronologicalAge,
        sex: formData.sex.toLowerCase(),
        methylation_file_id: formData.methylationFileId,
        rna_seq_file_id: formData.rnaSeqFileId,
        preprocessing_options: formData.preprocessingOptions,
        llm_config: { 
          model_name: config.modelName,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }
      };

      const response = await apiClient.post('/p1/predict-age', payload);
      clearInterval(interval);
      setProgress(100);
      setStage('Complete');
      
      const newId = response.data.experiment_id;
      if (newId) {
        setTimeout(() => {
          setIsRunning(false);
          navigate(`/experiment/p1/${newId}`);
        }, 500);
      }
    } catch (err: any) {
      console.error('Experiment failed:', err);
      clearInterval(interval);
      setIsRunning(false);
      setStage('Failed');
      setError(err.message || 'An error occurred during prediction.');
    }
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
          <div className="h-full flex flex-col p-8">
            <div className="mb-6 flex space-x-4">
               <div className="h-24 bg-slate-200 rounded-xl w-1/2 animate-pulse"></div>
               <div className="h-24 bg-slate-200 rounded-xl w-1/2 animate-pulse"></div>
            </div>
            <div className="mb-8 flex space-x-4">
              <div className="h-10 bg-slate-200 rounded-md w-32 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="h-10 bg-slate-200 rounded-md w-32 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-10 bg-slate-200 rounded-md w-48 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6 mb-8">
               <div className="h-full bg-slate-200 rounded-xl w-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
               <div className="h-full bg-slate-200 rounded-xl w-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="mt-auto w-full max-w-2xl mx-auto">
              <ProgressBar progress={progress} stage={stage} />
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center text-scientific-red">
            <AlertCircle size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold">Prediction Failed</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : id && id !== 'new' ? (
          <P1ResultsPanel experimentId={id} />
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
