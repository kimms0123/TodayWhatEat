# 오늘 뭐 먹지

상황/재료를 입력하면 **Gemini**로 메뉴·레시피를 추천하고, **맛집 모드**는 **카카오 지도 API**로 실제 등록된 맛집만 보여줍니다. 배달 모드는 배민 딥링크로 연결됩니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 열기기

## 환경변수

`.env.local`에 아래를 설정

| 변수 | 용도 |
|------|------|
| `GEMINI_API_KEY` | 배달 모드, 냉털 모드 (미설정 시 "Gemini API 연동 필요" 오류) |
| `KAKAO_REST_API_KEY` | 맛집 모드 – 카카오 로컬 API 키 (미설정 시 "Kakao API 연동 필요" 오류) |

[카카오 개발자 콘솔](https://developers.kakao.com/)에서 앱 생성 후 **REST API 키**를 발급받아 사용

## 화면

- `/`: 홈(모드 선택)
- `/delivery`: 배달 모드 → 추천 3개 + 배민 딥링크, **최근 검색** (localStorage) (배민 링크 미연결)
- `/fridge`: 냉털 모드 → 10분 레시피 1~2개, **최근 검색** (localStorage)
- `/places`: 맛집 모드 → **카카오 지도 실제 맛집** 검색 + 지도 링크, **최근 검색** (localStorage)
- `/community`: 커뮤니티 (준비 중)

