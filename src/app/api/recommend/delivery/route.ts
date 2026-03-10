import { NextResponse } from "next/server";
import { recommendDelivery } from "@/lib/recommend2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await recommendDelivery(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

