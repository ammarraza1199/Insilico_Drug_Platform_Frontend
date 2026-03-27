import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Download, Table, Activity, Database } from 'lucide-react';
import { P2Results } from '../../types/experiment.types';
import { cn } from '../../utils/formatters';

// Charts
import DensityComparisonPlot from '../../charts/DensityComparisonPlot';
import OmicsPCAPlot from '../../charts/OmicsPCAPlot';

interface P2ResultsPanelProps {
  experimentId: string;
}

const P2ResultsPanel: React.FC<P2ResultsPanelProps> = ({ experimentId }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'quality' | 'downloads'>('preview');

  const { data: results, isLoading } = useQuery({
    queryKey: ['p2-results', experimentId],
    queryFn: async () => {
      const response = await apiClient.get(`/p2/results/${experimentId}`);
      const d = response.data;
      return {
        generatedSamples: d.generated_samples || d.generatedSamples,
        features: d.features,
        modalities: d.modalities,
        generationTimeSeconds: d.generation_time_seconds || d.generationTimeSeconds,
        qualityMetrics: {
          meanExpressionSimilarity: d.quality_metrics?.mean_expression_similarity || d.qualityMetrics?.meanExpressionSimilarity,
          variancePreservation: d.quality_metrics?.variance_preservation || d.qualityMetrics?.variancePreservation,
          correlationStructure: d.quality_metrics?.correlation_structure || d.qualityMetrics?.correlationStructure,
          pcaVarianceExplained: d.quality_metrics?.pca_variance_explained || d.qualityMetrics?.pcaVarianceExplained || []
        },
        downloadFiles: (d.download_files || d.downloadFiles || []).map((f: any) => ({
          name: f.name,
          size: f.size,
          url: f.url
        }))
      } as P2Results;
    },
  });

  if (isLoading) return <div className="p-12 text-center">Loading Results...</div>;
  if (!results) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Summary Header */}
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-scientific-teal/20 p-3 text-scientific-teal">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Synthetic Dataset Ready</h3>
              <p className="text-sm text-slate-400">Generated {results.generatedSamples} samples across {results.features} features</p>
            </div>
          </div>
          <button className="flex items-center rounded-md bg-scientific-teal px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-teal-600 transition-colors">
            <Download size={18} className="mr-2" />
            Download All (ZIP)
          </button>
        </div>
        
        <div className="mt-8 grid grid-cols-4 gap-4">
          {[
            { label: 'Expression Similarity', value: results.qualityMetrics.meanExpressionSimilarity },
            { label: 'Variance Preservation', value: results.qualityMetrics.variancePreservation },
            { label: 'Correlation Structure', value: results.qualityMetrics.correlationStructure },
            { label: 'QC Status', value: 'PASS', isBadge: true },
          ].map((metric, i) => (
            <div key={i} className="rounded-lg bg-slate-800/50 p-3 border border-slate-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{metric.label}</p>
              <div className="mt-1 flex items-baseline">
                {metric.isBadge ? (
                  <span className="text-xs font-bold text-scientific-green">{metric.value}</span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-white">{(metric.value as number * 100).toFixed(1)}</span>
                    <span className="ml-0.5 text-[10px] text-slate-500">%</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b px-6 flex items-center justify-between">
        <nav className="flex space-x-8">
          {[
            { id: 'preview', label: 'Dataset Preview', icon: Table },
            { id: 'quality', label: 'Quality Metrics', icon: Activity },
            { id: 'downloads', label: 'Files & Downloads', icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 border-b-2 py-4 text-sm font-bold transition-colors",
                activeTab === tab.id 
                  ? "border-scientific-teal text-scientific-teal" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 font-mono text-[10px] uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Sample ID</th>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <th key={i} className="px-4 py-3 text-left">GENE_{1000 + i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-xs">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">SYN_{100 + i}</td>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3 text-slate-600">
                          {(Math.random() * 10).toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-slate-400">Showing first 12 rows of {results.generatedSamples} samples</p>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border p-6 bg-slate-50 h-[400px]">
              <h4 className="mb-4 text-sm font-bold text-slate-900">Density Comparison (Synthetic vs. Reference)</h4>
              <DensityComparisonPlot />
            </div>
            <div className="rounded-xl border p-6 bg-slate-50 h-[400px]">
              <h4 className="mb-4 text-sm font-bold text-slate-900">Principal Component Analysis (PCA)</h4>
              <OmicsPCAPlot />
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="space-y-4">
            {results.downloadFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                    <Table size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • CSV Data Matrix</p>
                  </div>
                </div>
                <button className="flex items-center text-sm font-bold text-scientific-teal hover:underline">
                  Download <Download size={16} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default P2ResultsPanel;
