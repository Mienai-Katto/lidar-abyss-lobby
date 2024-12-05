'use client';

import { RoomCard } from './room-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRooms } from '@/lib/hooks/use-rooms';

export function RoomList() {
  const { rooms, isLoading, error } = useRooms();

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Failed to load rooms. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading rooms...
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
        {rooms.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No rooms available. Create one to get started!
          </div>
        )}
      </div>
    </ScrollArea>
  );
}