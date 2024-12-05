'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Crown, Shield, Sword } from 'lucide-react';
import { useOptimisticRoom } from '@/lib/hooks/use-optimistic-room';

interface PlayerLobbyProps {
  roomId: string;
  playerId: string;
}

export function PlayerLobby({ roomId, playerId }: PlayerLobbyProps) {
  const { room, error, optimisticUpdatePlayer, isHost } = useOptimisticRoom(roomId);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReady = async () => {
    // Optimistic update
    optimisticUpdatePlayer(playerId, { isReady: true });

    try {
      await fetch(`/api/players/${playerId}/ready`, {
        method: 'POST',
      });
    } catch (error) {
      // Revert optimistic update on error
      optimisticUpdatePlayer(playerId, { isReady: false });
      toast({
        title: 'Error',
        description: 'Failed to update ready status',
        variant: 'destructive',
      });
    }
  };

  const handleStartGame = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/start`, {
        method: 'POST',
      });
      const data = await response.json();
      const player = data.players.find((p: any) => p.id === playerId);
      if (player) {
        setGameCode(player.gameCode);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start game',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-400">
        Failed to load room data. Please try again later.
      </div>
    );
  }

  if (!room) return null;

  const currentPlayer = room.players.find(p => p.id === playerId);
  const allPlayersReady = room.players.every(p => p.isReady);
  const canStartGame = isHost(playerId) && allPlayersReady;

  return (
    <div className="space-y-4">
      {gameCode ? (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Your Game Code</div>
          <div className="text-3xl font-mono bg-gray-700 p-4 rounded-lg">
            {gameCode}
          </div>
          <div className="flex justify-center items-center space-x-2">
            {currentPlayer?.role === 'HUMAN' ? (
              <Shield className="text-blue-400 h-6 w-6" />
            ) : (
              <Sword className="text-red-400 h-6 w-6" />
            )}
            <span className="text-lg">
              You are a {currentPlayer?.role?.toLowerCase()}
            </span>
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[200px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-2">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-gray-700 p-2 rounded"
                >
                  <span className="flex items-center gap-2">
                    {isHost(player.id) && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                    {player.name}
                  </span>
                  <span className={player.isReady ? 'text-green-400' : 'text-gray-400'}>
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          {!currentPlayer?.isReady ? (
            <Button
              onClick={handleReady}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Ready Up
            </Button>
          ) : canStartGame ? (
            <Button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Game
            </Button>
          ) : (
            <div className="text-center text-gray-400">
              {isHost(playerId) 
                ? 'Waiting for all players to be ready...'
                : 'Waiting for the host to start the game...'}
            </div>
          )}
        </>
      )}
    </div>
  );
}