import { NextResponse } from "next/server";
import { generate } from "@/lib/generate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { output, usedAI } = await generate(body);
    return NextResponse.json({ ok: true, usedAI, output });
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
