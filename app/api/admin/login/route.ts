import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json({ error: "Thiếu tên đăng nhập hoặc mật khẩu" }, { status: 400 });
  }

  const ok = await verifyAdminCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
  }

  const token = await createSessionToken(username);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
