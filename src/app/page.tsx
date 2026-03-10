import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
            MVP 프로토타입
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            오늘 뭐 먹지
          </h1>
          <p className="max-w-2xl text-zinc-600">
            상황을 고르면 AI가 메뉴를 추천하고, 바로 “배달 시키기”로 이어지도록
            만든 최소 기능 버전입니다.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/delivery"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-950">
                  배달 모드
                </h2>
                <p className="text-sm text-zinc-600">
                  상황 + 필터 → 추천 3개 → 배민 딥링크 검색
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                우선순위 1
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-900">
              시작하기 →
            </div>
          </Link>

          <Link
            href="/fridge"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-950">
                  냉털 모드
                </h2>
                <p className="text-sm text-zinc-600">
                  재료 입력 → 10분 레시피 1~2개(3줄 요약)
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                우선순위 2
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-900">
              시작하기 →
            </div>
          </Link>

          <Link
            href="/places"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-950">
                  맛집 모드
                </h2>
                <p className="text-sm text-zinc-600">
                  상황 + 위치 키워드 → AI 맛집 추천
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                옵션
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-900">
              시작하기 →
            </div>
          </Link>

          <Link
            href="/community"
            className="group rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-950">
                  커뮤니티 (준비 중)
                </h2>
                <p className="text-sm text-zinc-600">
                  나중에 직접 레시피/맛집 후기를 올릴 수 있는 공간입니다.
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                뼈대만 구성
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-900">
              앞으로 추가 예정
            </div>
          </Link>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h3 className="text-sm font-semibold text-zinc-900">Gemini 연결</h3>
          <p className="mt-2 text-sm text-zinc-600">
            환경변수 <code className="font-mono">GEMINI_API_KEY</code>가
            설정되어 있지 않으면 호출 시{" "}
            <span className="font-mono">"Gemini API 연동 필요"</span> 오류가
            표시됩니다.
          </p>
        </section>
      </main>
    </div>
  );
}
