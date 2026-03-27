import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import {
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // Fetch Projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response.data;
    },
  });

  // Fetch Recent Experiments
  const { data: experiments, isLoading: experimentsLoading } = useQuery({
    queryKey: ['experiments'],
    queryFn: async () => {
      const response = await apiClient.get('/experiments');
      return response.data;
    },
  });

  if (projectsLoading || experimentsLoading) {
    return <DashboardSkeleton />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 size={16} className="text-scientific-green" />;
      case 'running': return <PlayCircle size={16} className="text-scientific-blue animate-pulse" />;
      case 'failed': return <AlertCircle size={16} className="text-scientific-red" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Researcher</h1>
          <p className="text-slate-500 text-sm">Here is what is happening with your experiments today.</p>
        </div>
        <Link 
          to="/experiment/new"
          className="flex items-center rounded-md bg-scientific-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
        >
          <PlusCircle size={18} className="mr-2" />
          New Experiment
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Projects', value: projects?.length || 0, icon: ArrowRight },
          { label: 'Experiments Run', value: experiments?.length || 0, icon: CheckCircle2 },
          { label: 'Running Jobs', value: experiments?.filter((e: any) => e.status === 'running').length || 0, icon: PlayCircle },
          { label: 'Storage Used', value: '42.5 GB', icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <stat.icon size={20} className="text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Experiments Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Experiments</h2>
            <Link to="/history" className="text-sm font-medium text-scientific-blue hover:underline">View All</Link>
          </div>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Experiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {experimentsLoading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">Loading experiments...</td></tr>
                ) : experiments?.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/results/${exp.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{exp.name}</div>
                      <div className="text-xs text-slate-500">ID: {exp.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 uppercase">
                        {exp.system}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        {getStatusIcon(exp.status)}
                        <span className="ml-2 capitalize">{exp.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDistanceToNow(new Date(exp.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Launch / Projects Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-scientific-blue hover:underline">Manage All</Link>
          </div>
          <div className="space-y-4">
            {projectsLoading ? (
              <p className="text-sm text-slate-500 text-center py-4">Loading projects...</p>
            ) : projects?.map((project: any) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`}
                className="block rounded-xl border bg-white p-4 shadow-sm hover:border-scientific-blue transition-colors"
              >
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{project.description}</p>
                <div className="mt-3 flex items-center text-xs text-slate-400">
                  <Clock size={12} className="mr-1" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
