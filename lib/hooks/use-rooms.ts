'use client';

import { useState, useEffect } from 'react';
import type { Room } from '@/types/lobby';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useRooms() {
  const queryClient = useQueryClient();

  // Fetcher para buscar as salas
  const fetchRooms = async (): Promise<Room[]> => {
    const response = await fetch('/api/rooms');
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    return response.json();
  };

  const { data: rooms, error, isLoading } = useQuery<Room[], Error>({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 1000 * 60,
  });

  const invalidateRooms = () => {
    queryClient.invalidateQueries({
      queryKey: ['rooms'],
    });
  };

  return { rooms: rooms || [], isLoading, error, invalidateRooms };
}
