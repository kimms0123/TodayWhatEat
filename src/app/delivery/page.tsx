"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DeliveryRecommendation = {
  name: string;
  reason: string;
  searchQuery: string;
};

const situations = [
  "혼밥",
  "야식",
  "스트레스 받을 때",
  "데이트",
  "친구모임",
  "다이어트 중",
] as const;

const cuisines = [
  { value: "ANY", label: "아무거나" },
  { value: "KR", label: "한식" },
  { value: "CN", label: "중식" },
  { value: "WE", label: "양식" },
  { value: "JP", label: "일식" },
] as const;

const prices = [
  { value: "ANY", label: "상관없음" },
  { value: "LOW", label: "저렴" },
  { value: "MID", label: "보통" },
] as const;

const spices = [
  { value: "ANY", label: "상관없음" },
  { value: "MILD", label: "안매움" },
  { value: "MED", label: "보통" },
  { value: "HOT", label: "매움" },
] as const;

function baeminDeepLink(query: string) {
  return `baemin://search?query=${encodeURIComponent(query)}`;
}

export default function DeliveryPage() {
  const [situation, setSituation] = useState<(typeof situations)[number]>(
    situations[0],
  );
  const [cuisine, setCuisine] = useState<(typeof cuisines)[number]["value"]>(
    "ANY",
  );
  const [price, setPrice] = useState<(typeof prices)[number]["value"]>("ANY");
  const [spice, setSpice] = useState<(typeof spices)[number]["value"]>("ANY");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DeliveryRecommendation[] | null>(null);

  const payload = useMemo(
    () => ({ situation, cuisine, price, spice }),
    [situation, cuisine, price, spice],
  );

  async function onRecommend() {
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const res = await fetch("/api/recommend/delivery", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "추천 요청 실패");
      setItems(data.recommendations ?? []);
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
              배달 모드
            </h1>
            <p className="text-sm text-zinc-600">
              상황과 필터를 고르면 AI가 메뉴 3개를 추천해요.
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

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-900">
                  음식 종류
                </span>
                <select
                  value={cuisine}
                  onChange={(e) =>
                    setCuisine(
                      e.target.value as (typeof cuisines)[number]["value"],
                    )
                  }
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
                >
                  {cuisines.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-zinc-900">
                    가격대
                  </span>
                  <select
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value as (typeof prices)[number]["value"])
                    }
                    className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
                  >
                    {prices.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-zinc-900">
                    매운 정도
                  </span>
                  <select
                    value={spice}
                    onChange={(e) =>
                      setSpice(e.target.value as (typeof spices)[number]["value"])
                    }
                    className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
                  >
                    {spices.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-500">
              Gemini API 키가 없으면{" "}
              <span className="font-mono">"Gemini API 연동 필요"</span> 오류가
              표시됩니다.
            </div>
            <button
              type="button"
              onClick={onRecommend}
              disabled={loading}
              className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "추천 생성 중..." : "추천 받기"}
            </button>
          </div>
        </section>

        <section className="mt-6">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {items ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((x) => (
                <div
                  key={`${x.name}-${x.searchQuery}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-lg font-semibold text-zinc-950">
                    {x.name}
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">{x.reason}</div>

                  <div className="mt-4 grid gap-2">
                    <a
                      href={baeminDeepLink(x.searchQuery)}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      배달 시키기
                    </a>
                    <div className="rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                      배민 검색어:{" "}
                      <span className="font-mono text-zinc-800">
                        {x.searchQuery}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-sm text-zinc-500">
              아직 추천 결과가 없어요. 위에서 “추천 받기”를 눌러보세요.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

