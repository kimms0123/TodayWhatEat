"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FridgeRecipe = {
  name: string;
  difficulty: "하" | "중" | "상";
  timeMinutes: number;
  summary3Lines: string[];
  tips?: string[];
};

function parseIngredients(input: string) {
  return input
    .split(/[,\n]/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export default function FridgePage() {
  const [raw, setRaw] = useState("계란, 양파, 참치, 김치");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<FridgeRecipe[] | null>(null);

  const ingredients = useMemo(() => parseIngredients(raw), [raw]);

  async function onRecommend() {
    setLoading(true);
    setError(null);
    setRecipes(null);
    try {
      const res = await fetch("/api/recommend/fridge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "추천 요청 실패");
      setRecipes(data.recipes ?? []);
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
              냉털 모드
            </h1>
            <p className="text-sm text-zinc-600">
              재료를 입력하면 10분 완성 레시피를 1~2개로 요약해줘요.
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
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-900">재료</span>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none"
              placeholder="예) 계란, 양파, 참치, 김치"
            />
            <div className="text-xs text-zinc-500">
              쉼표(,) 또는 줄바꿈으로 구분해요. 현재{" "}
              <span className="font-semibold">{ingredients.length}</span>개
              인식됨.
            </div>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-500">
              Gemini API 키가 없으면{" "}
              <span className="font-mono">"Gemini API 연동 필요"</span> 오류가
              표시됩니다.
            </div>
            <button
              type="button"
              onClick={onRecommend}
              disabled={loading || ingredients.length === 0}
              className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "레시피 생성 중..." : "레시피 받기"}
            </button>
          </div>
        </section>

        <section className="mt-6">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {recipes ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {recipes.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-semibold text-zinc-950">
                      {r.name}
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                        {r.timeMinutes}분
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                        난이도 {r.difficulty}
                      </span>
                    </div>
                  </div>

                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
                    {r.summary3Lines.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ol>

                  {r.tips?.length ? (
                    <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
                      <div className="font-semibold text-zinc-800">팁</div>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {r.tips.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-sm text-zinc-500">
              아직 레시피 결과가 없어요. 위에서 “레시피 받기”를 눌러보세요.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

