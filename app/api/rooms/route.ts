import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        players: true,
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch rooms ${(error as Error).message}` },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, maxPlayers } = body;

    const room = await prisma.room.create({
      data: {
        name,
        maxPlayers,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create room ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
