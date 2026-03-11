import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from '../components/common/StatusBadge';
import type { AISystem, ExperimentStatus } from '../types/experiment.types';
import { cn } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const ExperimentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [systemFilter, setSystemFilter] = useState<AISystem | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | 'all'>('all');

  const { data: experiments, isLoading } = useQuery({
    queryKey: ['experiments-history'],
    queryFn: async () => {
      const response = await apiClient.get('/experiments');
      return response.data;
    },
  });

  const filteredExperiments = experiments?.filter((exp: any) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) || exp.id.includes(searchTerm);
    const matchesSystem = systemFilter === 'all' || exp.system === systemFilter;
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    return matchesSearch && matchesSystem && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Experiment History</h1>
        <div className="flex space-x-3">
          <button className="flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download size={16} className="mr-2" /> Export History
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-scientific-blue focus:outline-none focus:ring-1 focus:ring-scientific-blue"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value as any)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All Systems</option>
              <option value="p1">Precious1GPT</option>
              <option value="p2">Precious2GPT</option>
              <option value="p3">Precious3GPT</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="complete">Complete</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Experiment Details</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">System</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Runtime</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Created</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading history...</td></tr>
            ) : filteredExperiments?.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No experiments found matching your criteria.</td></tr>
            ) : filteredExperiments?.map((exp: any) => (
              <tr key={exp.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{exp.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{exp.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                    exp.system === 'p1' ? "bg-blue-100 text-scientific-blue" :
                    exp.system === 'p2' ? "bg-teal-100 text-scientific-teal" :
                    "bg-purple-100 text-scientific-purple"
                  )}>
                    {exp.system}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={exp.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {exp.runtimeSeconds ? `${exp.runtimeSeconds}s` : '--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right font-medium">
                  {format(new Date(exp.createdAt), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/results/${exp.id}`)}
                      className="rounded p-1.5 text-slate-400 hover:bg-scientific-blue/10 hover:text-scientific-blue"
                      title="View Results"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Reload Configuration"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button 
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-scientific-red"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing 1 to {filteredExperiments?.length} of {filteredExperiments?.length} results</p>
        <div className="flex items-center space-x-2">
          <button className="rounded border bg-white p-2 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="rounded border bg-scientific-blue px-3 py-1 text-sm font-bold text-white shadow-sm">1</button>
          <button className="rounded border bg-white p-2 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentHistoryPage;
