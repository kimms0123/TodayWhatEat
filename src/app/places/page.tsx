"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addHistory, getHistory, type HistoryItem } from "@/lib/history";

type Place = {
  name: string;
  address: string;
  roadAddress: string;
  placeUrl: string;
  categoryName: string;
  x: string;
  y: string;
};

const situations = ["데이트", "친구모임", "회식", "가벼운 한 잔", "가족 외식"] as const;

export default function PlacesPage() {
  const [situation, setSituation] =
    useState<(typeof situations)[number]>("데이트");
  const [location, setLocation] = useState("강남역");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(getHistory("places"));
  }, [places]);

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
      const list = data.places ?? [];
      setPlaces(list);
      if (list.length > 0) {
        addHistory(
          "places",
          { situation, location },
          list.map((p: Place) => p.name).join(", ")
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  function applyHistory(item: HistoryItem) {
    const input = item.input as { situation?: string; location?: string };
    if (input.situation && situations.includes(input.situation as (typeof situations)[number])) {
      setSituation(input.situation as (typeof situations)[number]);
    }
    if (input.location && typeof input.location === "string") {
      setLocation(input.location);
    }
    setError(null);
    setPlaces(null);
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
              카카오 지도에 등록된 실제 맛집을 검색해요. 상황과 위치를 골라보세요.
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
                카카오 지도에 검색되는 지역명을 입력하세요.
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-500">
              <span className="font-mono">KAKAO_REST_API_KEY</span>가 없으면
              &quot;Kakao API 연동 필요&quot; 오류가 표시됩니다.
            </div>
            <button
              type="button"
              onClick={onRecommend}
              disabled={loading || !location.trim()}
              className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "맛집 검색 중..." : "맛집 검색"}
            </button>
          </div>
        </section>

        {historyItems.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-900">최근 검색</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {historyItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => applyHistory(item)}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-100"
                  >
                    {item.summary}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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
                  key={p.placeUrl}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-lg font-semibold text-zinc-950">
                    {p.name}
                  </div>
                  {p.categoryName ? (
                    <div className="mt-1 text-xs text-zinc-500">
                      {p.categoryName}
                    </div>
                  ) : null}
                  <div className="mt-2 text-sm text-zinc-600">
                    {p.roadAddress || p.address}
                  </div>
                  <div className="mt-4">
                    <a
                      href={p.placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      지도에서 보기
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-sm text-zinc-500">
              아직 검색 결과가 없어요. 위에서 &quot;맛집 검색&quot;을 눌러보세요.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
