import { useState, useEffect, useCallback, useRef } from 'react';
import { projectService } from '../services';
import { useFetch, useCreate, useUpdate, useDelete } from './useApi.js';

export const useProjects = (page = 1, limit = 10) => {
  const { data: projects, setData: setProjects, loading, error, fetch } = useFetch(projectService, 'getAll');
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch({ page, limit, excludeImages: true });
    }
  }, []); // Empty deps - only run on mount

  return { projects, setProjects, loading, error, refetch: () => fetch({ page, limit }) };
};

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchProject = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectService.getById(id);
      setProject(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Only fetch once when id changes
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      fetchProject();
    }
    // Reset hasFetched when id changes
    return () => { hasFetched.current = false; };
  }, [id, fetchProject]);

  return { project, setProject, loading, error, refetch: fetchProject };
};

export const useCreateProject = () => useCreate(projectService);
export const useUpdateProject = () => useUpdate(projectService);
export const useDeleteProject = () => useDelete(projectService);
