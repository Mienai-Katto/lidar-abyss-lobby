import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { playerId: string } },
) {
  try {
    const { playerId } = params;

    const player = await prisma.player.update({
      where: { id: playerId },
      data: { isReady: true },
    });

    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to update player ready status [${(error as Error).message}]`,
      },
      { status: 500 },
    );
  }
}
