import { useEffect } from 'react';
import { certificateService } from '../services';
import { useFetch, useCreate, useUpdate, useDelete } from './useApi.js';

export const useCertificates = () => {
  const { data: certificates, setData: setCertificates, loading, error, fetch } = useFetch(certificateService);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { certificates, setCertificates, loading, error, refetch: fetch };
};

export const useCreateCertificate = () => useCreate(certificateService);
export const useUpdateCertificate = () => useUpdate(certificateService);
export const useDeleteCertificate = () => useDelete(certificateService);
