"use client";

import Link from "next/link";
import { useState } from "react";

type Place = {
  name: string;
  menu: string;
  reason: string;
  mapQuery: string;
};

function kakaoMapUrl(q: string) {
  return `https://map.kakao.com/?q=${encodeURIComponent(q)}`;
}

const situations = ["데이트", "친구모임", "회식", "가벼운 한 잔", "가족 외식"] as const;

export default function PlacesPage() {
  const [situation, setSituation] =
    useState<(typeof situations)[number]>("데이트");
  const [location, setLocation] = useState("강남역");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[] | null>(null);

  async function onRecommend() {
    setLoading(true);
    setError(null);
    setPlaces(null);
    try {
      const res = await fetch("/api/recommend/places", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "추천 요청 실패");
      setPlaces(data.places ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              맛집 모드
            </h1>
            <p className="text-sm text-zinc-600">
              상황과 위치 키워드를 입력하면 AI가 어울리는 맛집을 추천해줘요.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            홈으로
          </Link>
        </div>

        <section className="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-zinc-900">상황</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {situations.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSituation(s)}
                    className={[
                      "rounded-full px-3 py-1 text-sm font-medium transition",
                      s === situation
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-900">
                위치 키워드
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
                placeholder="예) 강남역, 홍대입구, 시청역"
              />
              <span className="text-xs text-zinc-500">
                정확한 주소가 아니라, 지도에서 검색할 수 있는 정도의 키워드면
                충분해요.
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-500">
              Gemini API 연동이 안 되어 있으면{" "}
              <span className="font-mono">"Gemini API 연동 필요"</span> 오류가
              표시됩니다.
            </div>
            <button
              type="button"
              onClick={onRecommend}
              disabled={loading || !location.trim()}
              className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "맛집 찾는 중..." : "맛집 추천 받기"}
            </button>
          </div>
        </section>

        <section className="mt-6">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {places ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {places.map((p) => (
                <div
                  key={`${p.name}-${p.menu}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-lg font-semibold text-zinc-950">
                    {p.name}
                  </div>
                  <div className="mt-1 text-sm font-medium text-zinc-800">
                    추천 메뉴: {p.menu}
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">{p.reason}</div>
                  <div className="mt-4 grid gap-2">
                    <a
                      href={kakaoMapUrl(p.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      지도에서 보기
                    </a>
                    <div className="rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                      지도 검색어:{" "}
                      <span className="font-mono text-zinc-800">
                        {p.mapQuery}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-sm text-zinc-500">
              아직 추천 결과가 없어요. 위에서 “맛집 추천 받기”를 눌러보세요.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

