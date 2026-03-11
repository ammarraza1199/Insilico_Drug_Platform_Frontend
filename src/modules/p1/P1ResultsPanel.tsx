import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Download, FileText, Share2, Info, AlertTriangle } from 'lucide-react';
import { P1Results } from '../../types/experiment.types';
import { cn } from '../../utils/formatters';

// Tabs Components (to be built)
import BiologicalAgeGauge from '../../charts/BiologicalAgeGauge';
import AgingDistributionChart from '../../charts/AgingDistributionChart';
import ShapBarChart from '../../charts/ShapBarChart';
import DiseaseClassificationChart from '../../charts/DiseaseClassificationChart';

interface P1ResultsPanelProps {
  experimentId: string;
}

const P1ResultsPanel: React.FC<P1ResultsPanelProps> = ({ experimentId }) => {
  const [activeTab, setActiveTab] = useState<'age' | 'shap' | 'disease' | 'targets'>('age');

  const { data: results, isLoading } = useQuery({
    queryKey: ['p1-results', experimentId],
    queryFn: async () => {
      const response = await apiClient.get(`/p1/results/${experimentId}`);
      return response.data as P1Results;
    },
  });

  if (isLoading) return <div className="p-12 text-center">Loading Results...</div>;
  if (!results) return null;

  const tabs = [
    { id: 'age', label: 'Biological Age' },
    { id: 'shap', label: 'Gene Importance (SHAP)' },
    { id: 'disease', label: 'Disease Classification' },
    { id: 'targets', label: 'Therapeutic Targets' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Results Header Card */}
      <div className="bg-slate-900 p-8 text-white">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Predicted Biological Age</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-scientific-blue">{results.predictedBiologicalAge}</span>
              <span className="text-lg font-medium text-slate-400">years</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chronological Age</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-slate-200">{results.chronologicalAge}</span>
              <span className="text-sm font-medium text-slate-500">years</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center space-x-4">
          <div className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tight",
            results.ageAccelerationClass === 'accelerated' ? "bg-scientific-red/20 text-scientific-red" : "bg-scientific-green/20 text-scientific-green"
          )}>
            {results.ageAccelerationClass === 'accelerated' ? <AlertTriangle size={14} className="mr-1.5" /> : null}
            Age Acceleration: {results.ageAccelerationScore > 0 ? '+' : ''}{results.ageAccelerationScore} years
          </div>
          <span className="text-sm text-slate-400">
            {results.ageAccelerationClass === 'accelerated' ? '⚠️ Accelerated Aging Detected' : '✅ Healthy Aging Profile'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "border-b-2 py-4 text-sm font-bold transition-colors",
                activeTab === tab.id 
                  ? "border-scientific-blue text-scientific-blue" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'age' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border p-6 bg-slate-50">
              <h4 className="mb-6 flex items-center text-sm font-bold text-slate-900">
                <Info size={16} className="mr-2 text-scientific-blue" />
                Biological Age Gauge
              </h4>
              <div className="flex justify-center py-8">
                <BiologicalAgeGauge predicted={results.predictedBiologicalAge} chronological={results.chronologicalAge} />
              </div>
            </div>
            <div className="rounded-xl border p-6 bg-slate-50">
              <h4 className="mb-6 flex items-center text-sm font-bold text-slate-900">
                <Info size={16} className="mr-2 text-scientific-blue" />
                Population Distribution
              </h4>
              <div className="h-64">
                <AgingDistributionChart predicted={results.predictedBiologicalAge} chronological={results.chronologicalAge} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shap' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Top Genes by SHAP Importance</h4>
              <button className="text-xs font-bold text-scientific-blue hover:underline">Export SHAP Table (CSV)</button>
            </div>
            <div className="h-[500px] rounded-xl border p-6 bg-slate-50">
              <ShapBarChart data={results.shapGenes} />
            </div>
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Age-Related Disease Risk Classification</h4>
            <div className="h-[400px] rounded-xl border p-6 bg-slate-50">
              <DiseaseClassificationChart data={results.diseaseClassification} />
            </div>
          </div>
        )}

        {activeTab === 'targets' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Identified Therapeutic Targets</h4>
            <div className="overflow-hidden rounded-xl border">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Gene Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">SHAP Score</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Expression</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Known Drug Target</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Actionability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {results.therapeuticTargets.map((target, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{target.gene}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{target.score.toFixed(3)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <span className={cn(
                           "rounded px-2 py-0.5 text-xs font-bold",
                           target.expressionLevel > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                         )}>
                           {target.expressionLevel > 0 ? 'High' : 'Low'}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {target.knownDrugTarget ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-scientific-purple" style={{ width: `${target.actionabilityScore * 10}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t bg-slate-50 p-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <button className="flex items-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
            <Download size={16} className="mr-2" /> Download PDF Report
          </button>
          <button className="flex items-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
            <FileText size={16} className="mr-2" /> Export JSON
          </button>
        </div>
        <button className="flex items-center text-sm font-bold text-scientific-blue hover:underline">
          <Share2 size={16} className="mr-2" /> Share Results
        </button>
      </div>
    </div>
  );
};

export default P1ResultsPanel;
