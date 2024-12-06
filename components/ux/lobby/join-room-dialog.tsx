'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types/lobby';
import { PlayerLobby } from './player-lobby';
import { useRooms } from '@/lib/hooks/use-rooms';

interface JoinRoomDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinRoomDialog({ room, open, onOpenChange }: JoinRoomDialogProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const { toast } = useToast();
  const { invalidateRooms } = useRooms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/rooms/${room.id}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to join room');
      
      const player = await response.json();
      setPlayerId(player.id);
      invalidateRooms();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room. Please try again.',
        variant: 'destructive',
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle>{playerId ? 'Game Lobby' : 'Join Room'}</DialogTitle>
        </DialogHeader>
        
        {!playerId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isLoading ? 'Joining...' : 'Join Game'}
            </Button>
          </form>
        ) : (
          <PlayerLobby roomId={room.id} playerId={playerId} />
        )}
      </DialogContent>
    </Dialog>
  );
}