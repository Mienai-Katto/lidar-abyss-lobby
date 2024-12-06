'use client';

import { useState, useEffect } from 'react';
import type { Room } from '@/types/lobby';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const fetchRooms = async () => {
    
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      
    }
  };


  const {data, error: queryError, isPending: isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await fetch('/api/rooms');
      return await response.json();
    },
  });

  
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (data) {
      setRooms(data);
      setError(null);
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       const response = await fetch('/api/rooms');
  //       const data = await response.json();
  //       setRooms(data);
  //       setError(null);
  //     } catch (err) {
  //       setError('Failed to fetch rooms');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchRooms();
  //   const interval = setInterval(fetchRooms, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const invalidateRooms = () => {
    queryClient.invalidateQueries({
      queryKey: ['rooms'],
    });
  };

  return { rooms, setRooms, isLoading, error, invalidateRooms };
}