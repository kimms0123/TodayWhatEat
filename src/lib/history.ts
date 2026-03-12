const STORAGE_KEY = "todayeat:history";
const MAX_ITEMS = 20;

export type HistoryMode = "delivery" | "fridge" | "places";

export type HistoryItem = {
  id: string;
  mode: HistoryMode;
  createdAt: string;
  input: Record<string, unknown>;
  summary: string;
};

function getStorage(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStorage(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

export function getHistory(mode?: HistoryMode): HistoryItem[] {
  const items = getStorage();
  if (mode) return items.filter((i) => i.mode === mode);
  return items;
}

export function addHistory(
  mode: HistoryMode,
  input: Record<string, unknown>,
  summary: string
): void {
  const items = getStorage();
  const next: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    mode,
    createdAt: new Date().toISOString(),
    input,
    summary,
  };
  setStorage([next, ...items].slice(0, MAX_ITEMS));
}

export function clearHistory(mode?: HistoryMode): void {
  if (mode) {
    setStorage(getStorage().filter((i) => i.mode !== mode));
  } else {
    setStorage([]);
  }
}
