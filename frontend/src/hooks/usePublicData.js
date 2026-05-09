import { useState, useEffect, useCallback } from 'react';
import { publicService } from '../services';

const PROFILE_CACHE_KEY = 'cached_profile_v2';
const PROJECTS_CACHE_KEY = 'cached_projects_v2';
const TESTIMONIALS_CACHE_KEY = 'cached_testimonials_v2';
const SKILLS_CACHE_KEY = 'cached_skills_v2';
const EXPERIENCES_CACHE_KEY = 'cached_experiences_v2';
const SERVICES_CACHE_KEY = 'cached_services_v2';
const CERTIFICATES_CACHE_KEY = 'cached_certificates_v2';
const CACHE_TIMESTAMP_KEY = 'cache_last_updated';

// Helper to safely set item in localStorage
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.warn('Storage quota exceeded, clearing old project caches...');
      // Clear specific project caches to free up space
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('cached_project_') || k.startsWith('cache_time_project_')) {
          localStorage.removeItem(k);
        }
      });
      // Try again once after clearing projects
      try {
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error('Failed to set item even after clearing projects:', retryError);
      }
    }
  }
};

// Clear all cached data - call this after admin updates
export const clearAllCaches = () => {
  // Clear v2 cache keys
  localStorage.removeItem(PROFILE_CACHE_KEY);
  localStorage.removeItem(PROJECTS_CACHE_KEY);
  localStorage.removeItem(TESTIMONIALS_CACHE_KEY);
  localStorage.removeItem(SKILLS_CACHE_KEY);
  localStorage.removeItem(EXPERIENCES_CACHE_KEY);
  localStorage.removeItem(SERVICES_CACHE_KEY);
  localStorage.removeItem(CERTIFICATES_CACHE_KEY);
  // Clear old v1 cache keys
  localStorage.removeItem('cached_profile');
  localStorage.removeItem('cached_projects');
  localStorage.removeItem('cached_testimonials');
  localStorage.removeItem('cached_skills');
  localStorage.removeItem('cached_experiences');
  localStorage.removeItem('cached_services');
  localStorage.removeItem('cached_certificates');
  // Clear old individual project caches
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('cached_project_') || k.startsWith('cache_time_project_')) {
      localStorage.removeItem(k);
    }
  });
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('All caches cleared');
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache

export const useProfile = () => {
  // Load cached data immediately to prevent flash of defaults
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    try {
      // Always fetch fresh profile data - no caching
      setLoading(true);
      setError(null);
      
      console.log('Fetching fresh profile data...');
      const response = await publicService.getProfile();
      const responseData = response.data || response;
      const actualProfile = responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)
        ? responseData.data
        : responseData;

      console.log('Profile fetched:', actualProfile);
      setProfile(actualProfile);
      safeSetItem(PROFILE_CACHE_KEY, JSON.stringify(actualProfile));
      safeSetItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
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
  
  return { profile, setProfile, loading, error, refetch: fetchProfile };
};

export const useProjects = (page = 1, limit = 6) => {
  // Always fetch fresh projects data - no caching
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh projects data...');
      const response = await publicService.getProjects({ page, limit });
      const data = response.data || response || [];
      console.log('Projects fetched:', data.length, 'projects');
      setProjects(data);
      setTotal(response.total || 0);
      setHasMore(data.length === limit);
      safeSetItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
      safeSetItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
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
  
  return { projects, loading, error, refetch: fetchProjects, total, hasMore };
};

export const useCertificates = () => {
  // Always fetch fresh certificates data - no caching
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh certificates data...');
      const response = await publicService.getCertificates();
      const data = response.data || [];
      console.log('Certificates fetched:', data.length, 'certificates');
      setCertificates(data);
      safeSetItem(CERTIFICATES_CACHE_KEY, JSON.stringify(data));
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
  // Always fetch fresh skills data - no caching
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fresh skills data...');
      const response = await publicService.getSkills();
      const data = response.data || [];
      console.log('Skills fetched:', data.length, 'skills');
      setSkills(data);
      safeSetItem(SKILLS_CACHE_KEY, JSON.stringify(data));
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
  // Always fetch fresh experiences data - no caching
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh experiences data...');
      const response = await publicService.getExperiences();
      const data = response.data || [];
      console.log('Experiences fetched:', data.length, 'experiences');
      setExperiences(data);
      safeSetItem(EXPERIENCES_CACHE_KEY, JSON.stringify(data));
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
  // Always fetch fresh testimonials data - no caching
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh testimonials data...');
      const response = await publicService.getTestimonials();
      const data = response.data || [];
      console.log('Testimonials fetched:', data.length, 'testimonials');
      setTestimonials(data);
      safeSetItem(TESTIMONIALS_CACHE_KEY, JSON.stringify(data));
      safeSetItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
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

  return { testimonials, loading, error, refetch: fetchTestimonials };
};

export const useServices = () => {
  // Always fetch fresh services data - no caching
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching fresh services data...');
      const response = await publicService.getServices();
      const data = response.data || [];
      console.log('Services fetched:', data.length, 'services');
      setServices(data);
      safeSetItem(SERVICES_CACHE_KEY, JSON.stringify(data));
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

// Disable localStorage caching for individual projects (too large)
// Only use in-memory state
export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await publicService.getProject(id);
      const data = response.data || response;
      setProject(data);
      setError(null);
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
