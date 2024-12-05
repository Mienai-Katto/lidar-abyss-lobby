'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRooms } from '@/lib/hooks/use-rooms';

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated: () => void;
}

export function CreateRoomDialog({ open, onOpenChange, onRoomCreated }: CreateRoomDialogProps) {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { rooms, setRooms } = useRooms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newRoom = {
      id: crypto.randomUUID(),
      name,
      maxPlayers: parseInt(maxPlayers, 10),
      status: 'WAITING',
      players: [],
    };

    // Optimistic update
    setRooms([...rooms, newRoom]);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, maxPlayers: parseInt(maxPlayers, 10) }),
      });

      if (!response.ok) throw new Error('Failed to create room');
      
      onRoomCreated();
    } catch (error) {
      // Revert optimistic update
      setRooms(rooms);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setName('');
      setMaxPlayers('4');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter room name"
              required
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              min="2"
              max="10"
              required
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}