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
        { status: 400 }
      );
    }

    const monsterIndex = Math.floor(Math.random() * room.players.length);

    const updatedPlayers = await Promise.all(
      room.players.map(async (player, index) => {
        const gameCode = crypto.randomBytes(6).toString("hex");
        return prisma.player.update({
          where: { id: player.id },
          data: {
            role: index === monsterIndex ? "MONSTER" : "HUMAN",
            gameCode,
          },
        });
      })
    );

    await prisma.room.update({
      where: { id: roomId },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ players: updatedPlayers });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { error: `Failed to start game [${(error as Error).message}]` },
      { status: 500 }
    );
  }
}