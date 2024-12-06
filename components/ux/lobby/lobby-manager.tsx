'use client';

import { useState } from 'react';
import { RoomList } from './room-list';
import { CreateRoomDialog } from './create-room-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LobbyManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRoomCreated = () => {
    setIsCreateDialogOpen(false);
    toast({
      title: 'Room Created',
      description: 'Your game room has been created successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-foreground font-medium"
        >
          <PlusCircle className="size-4" />
          Create Room
        </Button>
      </div>
      
      <RoomList />
      
      <CreateRoomDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}