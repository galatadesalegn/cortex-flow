import { useState, useEffect, useCallback } from 'react';
import { publicService } from '../services';

const PROFILE_CACHE_KEY = 'cached_profile';
const PROJECTS_CACHE_KEY = 'cached_projects';
const TESTIMONIALS_CACHE_KEY = 'cached_testimonials';
const CACHE_TIMESTAMP_KEY = 'cache_last_updated';

// Clear all cached data - call this after admin updates
export const clearAllCaches = () => {
  localStorage.removeItem(PROFILE_CACHE_KEY);
  localStorage.removeItem(PROJECTS_CACHE_KEY);
  localStorage.removeItem(TESTIMONIALS_CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('All caches cleared');
};

export const useProfile = () => {
  // Load cached data immediately to prevent flash of defaults
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we should skip cache
      const cacheTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const shouldSkipCache = forceRefresh || !cacheTime || (Date.now() - parseInt(cacheTime)) > 5 * 60 * 1000; // 5 minutes
      
      const response = await publicService.getProfile();
      const responseData = response.data || response;
      // Extract the actual profile if it's wrapped in a data property
      const actualProfile = responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)
        ? responseData.data
        : responseData;

      console.log('Profile fetched:', actualProfile);
      setProfile(actualProfile);
      // Cache the fresh data with timestamp
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(actualProfile));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Refresh when window gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchProfile(true); // Force refresh on focus
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchProfile]);

  return { profile, setProfile, loading, error, refetch: fetchProfile };
};

export const useProjects = (page = 1, limit = 6) => {
  // Load cached projects immediately
  const [projects, setProjects] = useState(() => {
    const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicService.getProjects({ page, limit });
      // API returns { data: [...], total: X } format
      const data = response.data || response || [];
      setProjects(data);
      setTotal(response.total || 0);
      setHasMore(data.length === limit);
      // Cache the fresh data
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchProjects(true);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects, total, hasMore };
};

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicService.getCertificates();
      setCertificates(response.data || []);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
};

export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicService.getSkills();
      setSkills(response.data || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, refetch: fetchSkills };
};

export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicService.getExperiences();
      setExperiences(response.data || []);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
      setError('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, error, refetch: fetchExperiences };
};

export const useTestimonials = () => {
  // Load cached testimonials immediately
  const [testimonials, setTestimonials] = useState(() => {
    const cached = localStorage.getItem(TESTIMONIALS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we should skip cache
      const cacheTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const shouldSkipCache = forceRefresh || !cacheTime || (Date.now() - parseInt(cacheTime)) > 5 * 60 * 1000; // 5 minutes

      const response = await publicService.getTestimonials();
      const data = response.data || [];
      setTestimonials(data);
      // Cache the fresh data
      localStorage.setItem(TESTIMONIALS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchTestimonials(true); // Force refresh on focus
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchTestimonials]);

  return { testimonials, loading, error, refetch: fetchTestimonials };
};

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicService.getServices();
      setServices(response.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
};

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await publicService.getProject(id);
      const data = response.data || response;
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
};
