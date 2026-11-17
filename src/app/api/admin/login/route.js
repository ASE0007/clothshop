import { NextResponse } from "next/server";
import { verifyAdmin, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const ok = await verifyAdmin(username, password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const token = await createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(setSessionCookie(token));
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}