"use client";

import { Room } from "@/types/lobby";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, PlayCircle, Copy } from "lucide-react";
import { JoinRoomDialog } from "./join-room-dialog";
import { useState } from "react";

interface RoomCardProps {
	room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
	const playerCount = room.players.length;
	const progress = (playerCount / room.maxPlayers) * 100;

	return (
		<>
			<Card className="bg-gray-800 border-gray-700">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>{room.name}</span>
						<span className="text-sm text-gray-400">
							{room.status.toLowerCase()}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Users className="h-4 w-4 text-gray-400" />
						<span className="text-sm text-gray-400">
							{playerCount} / {room.maxPlayers} players
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</CardContent>
				<CardFooter>
					{room.status !== "WAITING" || playerCount >= room.maxPlayers ? (
						<div>
							<div className="p-1 cursor-pointer">
								<Copy />
							</div>
						</div>
					) : (
						<Button
							onClick={() => setIsJoinDialogOpen(true)}
							className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
							disabled={
								room.status !== "WAITING" || playerCount >= room.maxPlayers
							}
						>
							<PlayCircle className="mr-2 h-4 w-4" />
							Join Game
						</Button>
					)}
				</CardFooter>
			</Card>

			<JoinRoomDialog
				room={room}
				open={isJoinDialogOpen}
				onOpenChange={setIsJoinDialogOpen}
			/>
		</>
	);
}
