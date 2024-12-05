import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  try {
    const { roomId } = params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (!room.players.every((player) => player.isReady)) {
      return NextResponse.json(
        { error: "Not all players are ready" },
        { status: 400 },
      );
    }

    // Randomly assign roles to players
    const players = [...room.players];
    const numMonsters = 1; // 1 monster per game
    const shuffled = players.sort(() => 0.5 - Math.random());

    const updatedPlayers = await Promise.all(
      shuffled.map(async (player, index) => {
        const gameCode = crypto.randomBytes(6).toString("hex");
        return prisma.player.update({
          where: { id: player.id },
          data: {
            role: index < numMonsters ? "MONSTER" : "HUMAN",
            gameCode,
          },
        });
      }),
    );

    await prisma.room.update({
      where: { id: roomId },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ players: updatedPlayers });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to start game [${(error as Error).message}]` },
      { status: 500 },
    );
  }
}
