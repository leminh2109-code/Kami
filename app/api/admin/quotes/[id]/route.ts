import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  status: z.enum(["MOI", "DANG_XU_LY", "DA_BAO_GIA", "HOAN_TAT", "HUY"]),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Không cập nhật được trạng thái" }, { status: 500 });
  }
}
