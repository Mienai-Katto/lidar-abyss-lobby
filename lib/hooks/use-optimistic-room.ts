'use client';

import { useState, useEffect } from 'react';
import { Room, Player } from '@/types/lobby';

export function useOptimisticRoom(roomId: string) {
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
    const interval = setInterval(fetchRoom, 1000); // Faster polling for real-time updates
    return () => clearInterval(interval);
  }, [roomId]);

  const optimisticUpdatePlayer = (playerId: string, updates: Partial<Player>) => {
    setRoom((currentRoom) => {
      if (!currentRoom) return null;
      return {
        ...currentRoom,
        players: currentRoom.players.map((player) =>
          player.id === playerId ? { ...player, ...updates } : player
        ),
      };
    });
  };

  const isHost = (playerId: string): boolean => {
    if (!room || !room.players.length) return false;
    return room.players[0].id === playerId;
  };

  return { room, isLoading, error, optimisticUpdatePlayer, isHost };
}