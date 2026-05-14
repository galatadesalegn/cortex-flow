import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, FolderKanban, CheckCircle, Clock, AlertCircle, Loader2, Trash2, Save, Send, Pencil, GripVertical } from 'lucide-react';
import ProjectEdit from './ProjectEdit';
import ProjectCreate from './ProjectCreate';
import { useProjects, useDeleteProject, useTheme, useAuth } from '../hooks';
import { projectService } from '../services';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableProjectItem = ({ project, onSelect, onDelete, deleting, isDark, isViewer }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col md:grid md:grid-cols-6 gap-4 px-4 py-4 md:py-3 rounded-lg border border-transparent transition-all group relative ${isDark ? 'bg-gray-800/30 hover:bg-gray-800/50 hover:border-blue-600/30' : 'bg-bg-secondary/50 hover:bg-bg-accent hover:border-accent/30 shadow-sm'
        }`}
    >
      <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical size={16} className="text-gray-500" />
      </div>

      <div onClick={() => onSelect(project)} className="cursor-pointer md:col-span-2">
        <p className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>{project.name}</p>
        <p className={`text-xs truncate transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>{project.description}</p>
      </div>

      <div className="flex md:block justify-between items-center" onClick={() => onSelect(project)}>
        <span className={`md:hidden text-xs uppercase ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Category</span>
        <span className={`text-sm cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>{project.category}</span>
      </div>

      <div className="flex md:block justify-between items-center" onClick={() => onSelect(project)}>
        <span className={`md:hidden text-xs uppercase ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Stack</span>
        <span className={`text-sm truncate cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>{project.stack}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex md:block justify-between items-center w-full md:w-auto" onClick={() => onSelect(project)}>
          <span className={`md:hidden text-xs uppercase ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Status</span>
          <div className="flex items-center gap-2 cursor-pointer">
            {project.status === 'Active' && <CheckCircle size={14} className="text-green-400" />}
            {project.status === 'In Progress' && <Clock size={14} className="text-yellow-400" />}
            {project.status === 'Maintenance' && <AlertCircle size={14} className="text-red-400" />}
            <span className={`text-sm ${project.status === 'Active' ? 'text-green-400' :
                project.status === 'In Progress' ? 'text-yellow-400' :
                  'text-red-400'
              }`}>{project.status}</span>
          </div>
        </div>

        {!isViewer && (
          <div className="flex items-center gap-2 absolute top-4 right-4 md:static md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(project);
              }}
              className="text-gray-500 hover:text-blue-400 transition-colors"
              title="Edit project"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              disabled={deleting}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Delete project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [localProjects, setLocalProjects] = useState([]);

  const { projects, loading, error, refetch, setProjects } = useProjects();
  const { delete: deleteProject, loading: deleting } = useDeleteProject();

  // Initialize localProjects when projects load
  useEffect(() => {
    if (projects) {
      setLocalProjects(projects?.map(p => ({
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
      })) || []);
    }
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = localProjects.findIndex((p) => p.id === active.id);
      const newIndex = localProjects.findIndex((p) => p.id === over.id);

      const newLocalProjects = arrayMove(localProjects, oldIndex, newIndex);
      setLocalProjects(newLocalProjects);

      try {
        await projectService.reorder(newLocalProjects.map(p => p.id));
        toast.success('Projects reordered successfully!');
        refetch();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reorder projects');
        // Revert on error
        setLocalProjects(localProjects);
      }
    }
  };

  const handleDelete = async (id) => {
    console.log('Deleting project with ID:', id);
    toast('Are you sure you want to delete this project?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          const result = await deleteProject(id);
          console.log('Delete result:', result);
          if (result.success) {
            toast.success('Project deleted successfully!');
            refetch();
          } else {
            toast.error(result.error || 'Failed to delete project');
            console.error('Delete error:', result.error);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { },
      },
    });
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

  if (isCreating && !isViewer) {
    return <ProjectCreate onBack={() => setIsCreating(false)} onSave={handleSave} />;
  }

  if (selectedProject) {
    return <ProjectEdit project={selectedProject._original} onBack={() => setSelectedProject(null)} onSave={handleSave} readOnly={isViewer} />;
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-blue-400 font-medium tracking-wider mb-1 uppercase">Architecture Overview</p>
          <h1 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>Project Management</h1>
        </div>
        {!isViewer && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveDraft}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all border ${isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-bg-secondary text-text-secondary border-border-theme hover:bg-bg-accent'
                }`}
            >
              <Save size={16} />
              <span className="text-sm font-medium">Save Draft</span>
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Send size={16} />
              <span className="text-sm font-medium">Publish</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className={`border rounded-xl p-6 mb-8 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 hover:border-gray-700' : 'bg-bg-card border-border-theme shadow-soft hover:shadow-md'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <FolderKanban className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>{localProjects.length}</h3>
              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Total Projects</p>
            </div>
          </div>
          {!isViewer && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-3 border rounded-xl p-6 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 hover:border-gray-700' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>Projects ({localProjects.length})</h2>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Refresh
            </button>
          </div>

          {!loading && !error && (
            <>
              {/* Table Header */}
              <div className={`hidden md:grid grid-cols-6 gap-4 px-4 py-3 rounded-lg mb-3 transition-colors duration-300 ${isDark ? 'bg-gray-800/50' : 'bg-bg-secondary'
                }`}>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}></span>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Project Context</span>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Category</span>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Stack Matrix</span>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Status</span>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}></span>
              </div>

              {/* Table Rows */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localProjects.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4 md:space-y-2">
                    {localProjects.length === 0 ? (
                      <div className={`text-center py-8 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>
                        <p>No projects found</p>
                      </div>
                    ) : (
                      localProjects.map((project) => (
                        <SortableProjectItem
                          key={project.id}
                          project={project}
                          onSelect={setSelectedProject}
                          onDelete={handleDelete}
                          deleting={deleting}
                          isDark={isDark}
                          isViewer={isViewer}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
