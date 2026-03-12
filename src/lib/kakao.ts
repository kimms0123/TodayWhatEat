export type KakaoPlace = {
  name: string;
  address: string;
  roadAddress: string;
  placeUrl: string;
  categoryName: string;
  x: string;
  y: string;
};

type KakaoDoc = {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  place_url: string;
  category_name: string;
  x: string;
  y: string;
};

export function searchKakaoPlaces(
  location: string,
  situation?: string
): Promise<{ places: KakaoPlace[] }> {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Kakao API 연동 필요");
  }

  const query = situation
    ? `${location} ${situation} 맛집`
    : `${location} 맛집`;
  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("size", "15");

  return fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Kakao API 호출 실패");
      }
      return res.json();
    })
    .then((data: { documents?: KakaoDoc[] }) => {
      const docs = data.documents ?? [];
      const places: KakaoPlace[] = docs.map((d) => ({
        name: d.place_name,
        address: d.address_name,
        roadAddress: d.road_address_name ?? "",
        placeUrl: d.place_url,
        categoryName: d.category_name,
        x: d.x,
        y: d.y,
      }));
      return { places };
    });
}
