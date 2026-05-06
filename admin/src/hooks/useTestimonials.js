import { useState, useEffect, useCallback, useRef } from 'react';
import { testimonialService } from '../services';
import { useFetch, useCreate, useUpdate, useDelete } from './useApi.js';

export const useTestimonials = () => {
  const { data: testimonials, setData: setTestimonials, loading, error, fetch } = useFetch(testimonialService, 'getAll');
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch();
    }
  }, []); // Empty deps - only run on mount

  return { testimonials, setTestimonials, loading, error, refetch: fetch };
};

export const useTestimonial = (id) => {
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchTestimonial = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await testimonialService.getById(id);
      setTestimonial(response.data);
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
      fetchTestimonial();
    }
    // Reset hasFetched when id changes
    return () => { hasFetched.current = false; };
  }, [id, fetchTestimonial]);

  return { testimonial, setTestimonial, loading, error, refetch: fetchTestimonial };
};

export const useCreateTestimonial = () => useCreate(testimonialService);
export const useUpdateTestimonial = () => useUpdate(testimonialService);
export const useDeleteTestimonial = () => useDelete(testimonialService);

export const useToggleTestimonial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await testimonialService.toggle(id);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading, error };
};
