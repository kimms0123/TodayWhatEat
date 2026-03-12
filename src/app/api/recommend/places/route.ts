import { NextResponse } from "next/server";
import { searchKakaoPlaces } from "@/lib/kakao";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { location, situation } = body;
    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json(
        { error: "위치 키워드를 입력해주세요." },
        { status: 400 }
      );
    }
    const result = await searchKakaoPlaces(location.trim(), situation);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

