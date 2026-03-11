import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { 
  Plus, 
  Folder, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ProjectsSkeleton from '../components/ui/ProjectsSkeleton';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null); // TODO: Define Project interface

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response.data;
    },
  });

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  const filteredProjects = projects?.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Projects</h1>
          <p className="text-sm text-slate-500">Manage your workspace and organized experiment collections.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-md bg-scientific-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={18} className="mr-2" />
          Create Project
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-scientific-blue focus:outline-none focus:ring-1 focus:ring-scientific-blue"
          />
        </div>
        <div className="flex items-center text-sm text-slate-500 px-4 py-2 bg-white rounded-lg border border-slate-100">
          <Folder size={16} className="mr-2 text-slate-400" />
          <span className="font-bold text-slate-900">{projects?.length || 0}</span>
          <span className="ml-1 uppercase text-[10px] font-bold tracking-wider">Total Projects</span>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 italic">Loading projects...</div>
        ) : filteredProjects?.map((project: any) => (
          <div key={project.id} className="group relative rounded-2xl border bg-white p-6 shadow-sm hover:border-scientific-blue hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-500 group-hover:bg-scientific-blue/10 group-hover:text-scientific-blue transition-colors">
                <Folder size={24} />
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingProject(project);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  title="Update Project"
                >
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-scientific-red">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
            <p className="mt-2 text-sm text-slate-500 line-clamp-2 h-10">{project.description}</p>

            <div className="mt-6 pt-6 border-t flex items-center justify-between">
              <div className="flex items-center text-xs text-slate-400">
                <Clock size={12} className="mr-1" />
                {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </div>
              <Link 
                to={`/projects/${project.id}`}
                className="inline-flex items-center text-sm font-bold text-scientific-blue hover:underline"
              >
                Open Workspace <ExternalLink size={14} className="ml-1.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Update Modal (Simplifed) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingProject ? 'Update Project' : 'Create New Project'}
            </h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input 
                  defaultValue={editingProject?.name || ''}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="e.g. Brain Aging Study"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  defaultValue={editingProject?.description || ''}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Goals and objectives..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 text-sm font-bold text-white bg-scientific-blue rounded-md hover:bg-blue-600">
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
