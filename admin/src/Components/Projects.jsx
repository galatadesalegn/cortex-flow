import { useState, useEffect } from 'react';
import { Plus, FolderKanban, CheckCircle, Clock, AlertCircle, Loader2, Trash2, Save, Send } from 'lucide-react';
import ProjectEdit from './ProjectEdit';
import ProjectCreate from './ProjectCreate';
import { useProjects, useDeleteProject } from '../hooks';
import { toast } from 'sonner';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { projects, loading, error, refetch } = useProjects();
  const { delete: deleteProject, loading: deleting } = useDeleteProject();

  // Transform API projects to match the UI format
  const projectList = projects?.map(p => ({
    id: p._id || p.id,
    name: p.title,
    description: p.description,
    category: p.category || 'Web App',
    stack: p.techStack?.join(', ') || 'React, Node.js',
    status: 'Active',
    liveUrl: p.liveDemo || '#',
    githubUrl: p.githubLink || '#',
    image: p.image,
    _original: p
  })) || [];

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    console.log('Deleting project with ID:', id);
    const result = await deleteProject(id);
    console.log('Delete result:', result);
    
    if (result.success) {
      toast.success('Project deleted successfully!');
      refetch();
    } else {
      toast.error(result.error || 'Failed to delete project');
      console.error('Delete error:', result.error);
    }
  };

  const handleSave = async () => {
    await refetch();
    setIsCreating(false);
    setSelectedProject(null);
  };

  // Save projects as draft to localStorage
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('projects_draft', JSON.stringify(projects));
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Draft save error:', error);
    }
  };

  // Load draft on mount if exists
  useEffect(() => {
    const draft = localStorage.getItem('projects_draft');
    if (draft && !projects?.length) {
      toast.info('Draft projects available');
    }
  }, [projects]);

  if (isCreating) {
    return <ProjectCreate onBack={() => setIsCreating(false)} onSave={handleSave} />;
  }

  if (selectedProject) {
    return <ProjectEdit project={selectedProject._original} onBack={() => setSelectedProject(null)} onSave={handleSave} />;
  }
  return (
    <div className="p-6 bg-[#0a0a0f] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-blue-400 font-medium tracking-wider mb-1">ARCHITECTURE OVERVIEW</p>
          <h1 className="text-2xl font-bold text-white">Project Management</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-gray-700"
          >
            <Save size={16} />
            <span className="text-sm font-medium">Save Draft</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all">
            <Send size={16} />
            <span className="text-sm font-medium">Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-8 hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <FolderKanban className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">{projectList.length}</h3>
              <p className="text-sm text-gray-400">Total Projects</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Add Project</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-3 bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Projects ({projectList.length})</h2>
            <button 
              onClick={() => refetch()}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Refresh
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-400">
              <p>Error loading projects</p>
              <button 
                onClick={() => refetch()}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-800/50 rounded-lg mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project Context</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Category</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Stack Matrix</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
              </div>

              {/* Table Rows */}
              <div className="space-y-2">
                {projectList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No projects found</p>
                    <p className="text-sm mt-1">Create your first project using the Quick Ingress form</p>
                  </div>
                ) : (
                  projectList.map((project) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 hover:border-blue-600/30 border border-transparent transition-all group">
                      <div onClick={() => setSelectedProject(project)} className="cursor-pointer">
                        <p className="text-sm font-medium text-white">{project.name}</p>
                        <p className="text-xs text-gray-500 truncate">{project.description}</p>
                      </div>
                      <span onClick={() => setSelectedProject(project)} className="text-sm text-gray-300 cursor-pointer">{project.category}</span>
                      <span onClick={() => setSelectedProject(project)} className="text-sm text-gray-300 truncate cursor-pointer">{project.stack}</span>
                      <div className="flex items-center justify-between">
                        <div onClick={() => setSelectedProject(project)} className="flex items-center gap-2 cursor-pointer">
                          {project.status === 'Active' && <CheckCircle size={14} className="text-green-400" />}
                          {project.status === 'In Progress' && <Clock size={14} className="text-yellow-400" />}
                          {project.status === 'Maintenance' && <AlertCircle size={14} className="text-red-400" />}
                          <span className={`text-sm ${
                            project.status === 'Active' ? 'text-green-400' :
                            project.status === 'In Progress' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>{project.status}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          disabled={deleting}
                          className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
