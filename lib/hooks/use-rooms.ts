'use client';

import { useState, useEffect } from 'react';
import { Room } from '@/types/lobby';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        setRooms(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  return { rooms, setRooms, isLoading, error };
}