import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  try {
    const body = await request.json();
    const { name } = body;
    const { roomId } = params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.players.length >= room.maxPlayers) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    const player = await prisma.player.create({
      data: {
        name,
        roomId,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to add player to room ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
