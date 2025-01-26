import { useEffect } from 'react';
import { messageService } from '../services';
import { useFetch, useDelete } from './useApi.js';

export const useMessages = () => {
  const { data: messages, setData: setMessages, loading, error, fetch } = useFetch(messageService);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { messages, setMessages, loading, error, refetch: fetch };
};

export const useDeleteMessage = () => useDelete(messageService);
