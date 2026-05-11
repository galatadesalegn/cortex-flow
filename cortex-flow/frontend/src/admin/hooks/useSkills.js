import { useEffect } from 'react';
import { skillService } from '../services';
import { useFetch, useCreate, useUpdate, useDelete } from './useApi.js';

export const useSkills = () => {
  const { data: skills, setData: setSkills, loading, error, fetch } = useFetch(skillService);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { skills, setSkills, loading, error, refetch: fetch };
};

export const useSkillsByCategory = (category) => {
  const { data: skills, loading, error, fetch } = useFetch(skillService, 'getByCategory');

  useEffect(() => {
    if (category) {
      fetch(category);
    }
  }, [category, fetch]);

  return { skills, loading, error, refetch: fetch };
};

export const useCreateSkill = () => useCreate(skillService);
export const useUpdateSkill = () => useUpdate(skillService);
export const useDeleteSkill = () => useDelete(skillService);
