import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

const schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: z.string(),
  material: z.string(),
  description: z.string().default(""),
  imageUrl: z.string().url(),
  minQuantity: z.number().int().positive(),
  isCustomizable: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name) + "-" + data.code.toLowerCase();

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...data,
        category: data.category as any,
        material: data.material as any,
        slug,
      },
    });
    return NextResponse.json(product);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Mã sản phẩm đã tồn tại, vui lòng dùng mã khác" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Không cập nhật được sản phẩm" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không xoá được sản phẩm" }, { status: 500 });
  }
}
