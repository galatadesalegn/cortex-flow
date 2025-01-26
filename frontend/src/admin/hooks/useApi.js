import { useState, useCallback, useRef, useEffect } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      setData(response.data || response);
      return { success: true, data: response.data || response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

// Global in-memory cache for API responses
const apiCache = new Map();

export const clearApiCache = (serviceName = null) => {
  if (serviceName) {
    for (const key of apiCache.keys()) {
      if (key.startsWith(serviceName)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
};

// Pre-built hooks for common operations
export const useFetch = (service, method = 'getAll', defaultParams = {}) => {
  const [data, setData] = useState(() => {
    // Try to initialize from cache if possible
    const cacheKey = `${service.constructor.name}_${method}_${JSON.stringify(defaultParams)}`;
    return apiCache.get(cacheKey) || [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Store service/method in refs to avoid dependency issues
  const serviceRef = useRef(service);
  const methodRef = useRef(method);
  const defaultParamsRef = useRef(defaultParams);
  
  // Update refs when values change
  useEffect(() => {
    serviceRef.current = service;
    methodRef.current = method;
    defaultParamsRef.current = defaultParams;
  }, [service, method, defaultParams]);

  const fetch = useCallback(async (params = {}, forceRefresh = false) => {
    const finalParams = { ...defaultParamsRef.current, ...params };
    const cacheKey = `${serviceRef.current.constructor.name}_${methodRef.current}_${JSON.stringify(finalParams)}`;

    // If not force refresh and we have cached data, use it immediately
    if (!forceRefresh && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      // Still fetch in background to keep data fresh (stale-while-revalidate)
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await serviceRef.current[methodRef.current](finalParams);
      const result = response.data || response;
      
      // Update cache
      apiCache.set(cacheKey, result);
      setData(result);
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - refs always stable

  return { data, setData, loading, error, fetch };
};

export const useCreate = (service) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.create(data);
      clearApiCache(service.constructor.name);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { create, loading, error };
};

export const useUpdate = (service) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.update(id, data);
      clearApiCache(service.constructor.name);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { update, loading, error };
};

export const useDelete = (service) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.delete(id);
      clearApiCache(service.constructor.name);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete item';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { delete: remove, loading, error };
};
