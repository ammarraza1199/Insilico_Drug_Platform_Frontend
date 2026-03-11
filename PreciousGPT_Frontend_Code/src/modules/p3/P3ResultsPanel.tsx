import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Download, Share2, ChevronRight, FlaskConical } from 'lucide-react';
import { P3Results } from '../../types/experiment.types';
import { cn } from '../../utils/formatters';

// Charts
import ExpressionHeatmap from '../../charts/ExpressionHeatmap';
import VolcanoPlot from '../../charts/VolcanoPlot';
import EnrichedPathwayChart from '../../charts/EnrichedPathwayChart';
import GenePathwayNetwork from '../../charts/GenePathwayNetwork';

interface P3ResultsPanelProps {
  experimentId: string;
}

const P3ResultsPanel: React.FC<P3ResultsPanelProps> = ({ experimentId }) => {
  const [activeTab, setActiveTab] = useState<'rankings' | 'expression' | 'pathway' | 'network'>('rankings');

  const { data: results, isLoading } = useQuery({
    queryKey: ['p3-results', experimentId],
    queryFn: async () => {
      const response = await apiClient.get(`/p3/results/${experimentId}`);
      const d = response.data;
      return {
        compoundsScreened: d.compounds_screened || d.compoundsScreened,
        topCandidates: (d.top_candidates || d.topCandidates || []).map((c: any) => ({
          rank: c.rank,
          compoundId: c.compound_id || c.compoundId,
          compoundName: c.compound_name || c.compoundName,
          smiles: c.smiles,
          efficacyScore: c.efficacy_score || c.efficacyScore,
          selectivityScore: c.selectivity_score || c.selectivityScore,
          toxicityFlag: c.toxicity_flag || c.toxicityFlag,
          mechanismOfAction: c.mechanism_of_action || c.mechanismOfAction,
          predictedGeneChanges: c.predicted_gene_changes || c.predictedGeneChanges || {}
        })),
        enrichedPathways: (d.enriched_pathways || d.enrichedPathways || []).map((p: any) => ({
          pathway: p.pathway,
          pValue: p.p_value || p.pValue,
          enrichmentScore: p.enrichment_score || p.enrichmentScore,
          geneCount: p.gene_count || p.geneCount
        })),
        geneExpressionMatrix: d.gene_expression_matrix || d.geneExpressionMatrix || {}
      } as P3Results;
    },
  });

  if (isLoading) return <div className="p-12 text-center">Loading Screening Results...</div>;
  if (!results) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Discovery Header */}
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-scientific-purple/20 p-3 text-scientific-purple">
              <FlaskConical size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Discovery Pipeline Complete</h3>
              <p className="text-sm text-slate-400">Screened {results.compoundsScreened.toLocaleString()} compounds against target signature</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
               <Share2 size={16} className="mr-2" /> Share
            </button>
            <button className="flex items-center rounded-md bg-scientific-purple px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-purple-600 transition-colors">
              <Download size={18} className="mr-2" /> Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'rankings', label: 'Top Compound Rankings' },
            { id: 'expression', label: 'Predicted Expression' },
            { id: 'pathway', label: 'Pathway Analysis' },
            { id: 'network', label: 'Gene Network' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "border-b-2 py-4 text-sm font-bold transition-colors",
                activeTab === tab.id 
                  ? "border-scientific-purple text-scientific-purple" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {results.topCandidates.map((candidate) => (
                <div key={candidate.compoundId} className="group rounded-xl border bg-white p-6 shadow-sm hover:border-scientific-purple transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-400 group-hover:bg-scientific-purple/10 group-hover:text-scientific-purple">
                        #{candidate.rank}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{candidate.compoundName}</h4>
                        <p className="font-mono text-[10px] text-slate-400">{candidate.smiles}</p>
                      </div>
                    </div>
                    <div className="flex space-x-8 text-right">
                       <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Efficacy Score</p>
                        <p className="text-xl font-black text-scientific-purple">{(candidate.efficacyScore * 100).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Selectivity</p>
                        <p className="text-xl font-black text-slate-700">{(candidate.selectivityScore * 100).toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                       <span className="rounded bg-slate-100 px-2 py-0.5">{candidate.mechanismOfAction}</span>
                       {candidate.toxicityFlag && <span className="rounded bg-amber-100 text-amber-700 px-2 py-0.5">⚠️ {candidate.toxicityFlag}</span>}
                    </div>
                    <button className="flex items-center text-xs font-bold text-scientific-purple hover:underline">
                      View Perturbation Profile <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expression' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 h-[500px]">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
               <h4 className="mb-4 text-sm font-bold text-slate-900">Predicted Perturbation Heatmap</h4>
               <ExpressionHeatmap />
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
               <h4 className="mb-4 text-sm font-bold text-slate-900">Log2 Fold Change (Volcano Plot)</h4>
               <VolcanoPlot />
            </div>
          </div>
        )}

        {activeTab === 'pathway' && (
          <div className="space-y-6">
             <div className="rounded-xl border bg-white p-6 shadow-sm">
               <h4 className="mb-6 text-sm font-bold text-slate-900">Enriched Pathways for Top Candidates</h4>
               <div className="h-[400px]">
                 <EnrichedPathwayChart data={results.enrichedPathways} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="rounded-xl border bg-white p-6 shadow-sm h-[600px] relative overflow-hidden">
             <div className="absolute top-6 left-6 z-10">
                <h4 className="text-sm font-bold text-slate-900">Gene Interaction Network</h4>
                <p className="text-[10px] text-slate-400 italic">Nodes sized by perturbation magnitude</p>
             </div>
             <GenePathwayNetwork />
          </div>
        )}
      </div>
    </div>
  );
};

export default P3ResultsPanel;
