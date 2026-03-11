import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { ChevronLeft, History as HistoryIcon, Settings } from 'lucide-react';
import P1ResultsPanel from '../modules/p1/P1ResultsPanel';
import P2ResultsPanel from '../modules/p2/P2ResultsPanel';
import P3ResultsPanel from '../modules/p3/P3ResultsPanel';
import type { AISystem } from '../types/experiment.types';

const ResultsViewerPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();

  const { data: experiment, isLoading } = useQuery({
    queryKey: ['experiment-detail', experimentId],
    queryFn: async () => {
      // In mock mode, we'll infer the system from the ID prefix or return a default
      const response = await apiClient.get(`/experiments`);
      const exp = response.data.find((e: any) => e.id === experimentId);
      return exp || { id: experimentId, system: 'p1', name: 'Legacy Experiment', status: 'complete' };
    },
  });

  if (isLoading) return <div className="p-12 text-center">Loading experiment details...</div>;

  const renderResults = () => {
    switch (experiment?.system as AISystem) {
      case 'p1': return <P1ResultsPanel experimentId={experimentId!} />;
      case 'p2': return <P2ResultsPanel experimentId={experimentId!} />;
      case 'p3': return <P3ResultsPanel experimentId={experimentId!} />;
      default: return <div>Unknown system type</div>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Results Viewer</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">{experimentId}</span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{experiment?.name}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center rounded-md border bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            <HistoryIcon size={14} className="mr-1.5" /> Reload Config
          </button>
          <button className="flex items-center rounded-md border bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            <Settings size={14} className="mr-1.5" /> Metadata
          </button>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="flex-1 overflow-hidden rounded-2xl border bg-white shadow-xl">
        {renderResults()}
      </div>
    </div>
  );
};

export default ResultsViewerPage;
