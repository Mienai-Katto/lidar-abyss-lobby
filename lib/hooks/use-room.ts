'use client';

import { useState, useEffect } from 'react';
import { Room } from '@/types/lobby';

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        const currentRoom = rooms.find((r: Room) => r.id === roomId);
        setRoom(currentRoom);
        setError(null);
      } catch (err) {
        setError('Failed to fetch room data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  return { room, isLoading, error };
}