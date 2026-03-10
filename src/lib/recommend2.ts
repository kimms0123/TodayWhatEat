import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const DeliveryInputSchema = z.object({
  situation: z.string().min(1),
  cuisine: z.enum(["ANY", "KR", "CN", "WE", "JP"]).default("ANY"),
  price: z.enum(["ANY", "LOW", "MID"]).default("ANY"),
  spice: z.enum(["ANY", "MILD", "MED", "HOT"]).default("ANY"),
});

const DeliveryResultSchema = z.object({
  recommendations: z
    .array(
      z.object({
        name: z.string().min(1),
        reason: z.string().min(1),
        searchQuery: z.string().min(1),
      }),
    )
    .min(1)
    .max(3),
});

export type DeliveryInput = z.infer<typeof DeliveryInputSchema>;
export type DeliveryResult = z.infer<typeof DeliveryResultSchema>;

const cuisineLabel: Record<DeliveryInput["cuisine"], string> = {
  ANY: "아무거나",
  KR: "한식",
  CN: "중식",
  WE: "양식",
  JP: "일식",
};

const priceLabel: Record<DeliveryInput["price"], string> = {
  ANY: "상관없음",
  LOW: "저렴",
  MID: "보통",
};

const spiceLabel: Record<DeliveryInput["spice"], string> = {
  ANY: "상관없음",
  MILD: "안매움",
  MED: "보통",
  HOT: "매움",
};

const FridgeInputSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(20),
});

const FridgeResultSchema = z.object({
  recipes: z
    .array(
      z.object({
        name: z.string().min(1),
        difficulty: z.enum(["하", "중", "상"]),
        timeMinutes: z.number().int().min(1).max(10),
        summary3Lines: z.array(z.string().min(1)).length(3),
        tips: z.array(z.string().min(1)).max(3).default([]),
      }),
    )
    .min(1)
    .max(2),
});

export type FridgeInput = z.infer<typeof FridgeInputSchema>;
export type FridgeResult = z.infer<typeof FridgeResultSchema>;

const PlacesInputSchema = z.object({
  situation: z.string().min(1),
  location: z.string().min(1),
});

const PlacesResultSchema = z.object({
  places: z
    .array(
      z.object({
        name: z.string().min(1),
        menu: z.string().min(1),
        reason: z.string().min(1),
        mapQuery: z.string().min(1),
      }),
    )
    .min(1)
    .max(5),
});

export type PlacesInput = z.infer<typeof PlacesInputSchema>;
export type PlacesResult = z.infer<typeof PlacesResultSchema>;

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API 연동 필요");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

function safeJsonExtract(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function recommendDelivery(raw: unknown): Promise<DeliveryResult> {
  const input = DeliveryInputSchema.parse(raw);
  const model = getModel();

  const prompt = `
너는 한국 사용자에게 "배달 메뉴 추천"을 해주는 추천 엔진이야.
아래 입력에 맞춰 추천 메뉴 3개를 제안해줘.

[입력]
- 상황: ${input.situation}
- 선호: ${cuisineLabel[input.cuisine]}
- 가격대: ${priceLabel[input.price]}
- 매운 정도: ${spiceLabel[input.spice]}

[출력 규칙]
- 반드시 JSON만 출력해. 다른 텍스트 금지.
- 스키마는 아래와 동일해야 해.
{
  "recommendations": [
    { "name": "메뉴명", "reason": "한 줄 추천 이유", "searchQuery": "배민 검색어" },
    { "name": "...", "reason": "...", "searchQuery": "..." },
    { "name": "...", "reason": "...", "searchQuery": "..." }
  ]
}
- name은 사용자에게 보이는 메뉴명, searchQuery는 배민 검색어로 적합해야 해.
`;

  try {
    const resp = await model.generateContent(prompt);
    const text = resp.response.text();
    const json = safeJsonExtract(text);
    return DeliveryResultSchema.parse(json ?? {});
  } catch (e) {
    if (e instanceof Error && e.message === "Gemini API 연동 필요") {
      throw e;
    }
    throw new Error("Gemini API 호출 실패");
  }
}

export async function recommendFridge(raw: unknown): Promise<FridgeResult> {
  const input = FridgeInputSchema.parse(raw);
  const model = getModel();

  const prompt = `
너는 자취생을 위한 "냉장고 재료 기반 10분 레시피 추천" 엔진이야.
아래 재료로 만들기 쉬운 메뉴 1~2개를 제안해줘.

[재료]
${input.ingredients.map((x) => `- ${x}`).join("\n")}

[출력 규칙]
- 반드시 JSON만 출력해. 다른 텍스트 금지.
- timeMinutes는 10 이하의 정수.
- summary3Lines는 반드시 3줄.
{
  "recipes": [
    {
      "name": "메뉴명",
      "difficulty": "하|중|상",
      "timeMinutes": 1,
      "summary3Lines": ["1", "2", "3"],
      "tips": ["선택"]
    }
  ]
}
- 너무 창작하지 말고, 일반적으로 널리 알려진 레시피 위주로.
`;

  try {
    const resp = await model.generateContent(prompt);
    const text = resp.response.text();
    const json = safeJsonExtract(text);
    return FridgeResultSchema.parse(json ?? {});
  } catch (e) {
    if (e instanceof Error && e.message === "Gemini API 연동 필요") {
      throw e;
    }
    throw new Error("Gemini API 호출 실패");
  }
}

export async function recommendPlaces(raw: unknown): Promise<PlacesResult> {
  const input = PlacesInputSchema.parse(raw);
  const model = getModel();

  const prompt = `
너는 한국 사용자에게 "상황 기반 맛집 추천"을 해주는 엔진이야.
실제 존재할 법한 가게 이름과 추천 메뉴를 만들어줘.

[입력]
- 상황: ${input.situation}
- 위치 키워드: ${input.location}

[출력 규칙]
- 반드시 JSON만 출력해. 다른 텍스트 금지.
- 스키마는 아래와 동일해야 해.
{
  "places": [
    {
      "name": "가게 이름",
      "menu": "추천 메뉴",
      "reason": "한 줄 추천 이유",
      "mapQuery": "지도 검색어 (예: 강남역 마라탕 맛집)"
    }
  ]
}
- mapQuery는 카카오/네이버 지도 검색창에 그대로 넣어도 되는 형태로 만들어줘.
`;

  try {
    const resp = await model.generateContent(prompt);
    const text = resp.response.text();
    const json = safeJsonExtract(text);
    return PlacesResultSchema.parse(json ?? {});
  } catch (e) {
    if (e instanceof Error && e.message === "Gemini API 연동 필요") {
      throw e;
    }
    throw new Error("Gemini API 호출 실패");
  }
}

