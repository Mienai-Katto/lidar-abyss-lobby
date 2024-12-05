import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { code: string } },
) {
  try {
    const { code } = params;

    const player = await prisma.player.findUnique({
      where: { gameCode: code },
      include: {
        room: {
          include: {
            players: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Invalid game code" }, { status: 404 });
    }

    return NextResponse.json({
      player: {
        id: player.id,
        name: player.name,
        role: player.role,
      },
      room: {
        id: player.room.id,
        name: player.room.name,
        status: player.room.status,
        players: player.room.players.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch game data [${(error as Error).message}]` },
      { status: 500 },
    );
  }
}
