import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const tx = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      order: { select: { id: true, code: true } },
      customer: { select: { id: true, name: true } },
      workshop: { select: { id: true, name: true } },
    },
  });
  if (!tx) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(tx);
}
