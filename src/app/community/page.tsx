import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              커뮤니티 (준비 중)
            </h1>
            <p className="text-sm text-zinc-600">
              나중에 직접 레시피, 냉털 성공기, 맛집 후기 등을 올릴 수 있는
              공간입니다.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            홈으로
          </Link>
        </div>

        <section className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
          <p>
            - 게시글 목록, 상세 페이지, 글쓰기 폼, 좋아요/댓글 등이 이곳에
            추가될 예정입니다.
          </p>
          <p className="mt-2">
            - 프론트/백엔드 구조를 어느 정도 확정한 뒤, 로그인 없이 닉네임 기반
            CRUD부터 차근차근 추가하면 됩니다.
          </p>
        </section>
      </main>
    </div>
  );
}

