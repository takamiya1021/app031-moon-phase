/**
 * ローカルストレージユーティリティ - Phase 5-1
 * データの保存・読み込み
 */

import type { AppSettings, MoonHistory } from '@/types/moon';

const STORAGE_KEYS = {
  API_KEY: 'moon-app-api-key',
  FAVORITES: 'moon-app-favorites',
  HISTORY: 'moon-app-history',
};

/**
 * APIキーを保存
 * @param apiKey - APIキー
 */
export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
}

/**
 * APIキーを読み込み
 * @returns APIキー
 */
export function loadApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
}

/**
 * お気に入り日付を保存
 * @param dates - お気に入り日付の配列
 */
export function saveFavorites(dates: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(dates));
}

/**
 * お気に入り日付を読み込み
 * @returns お気に入り日付の配列
 */
export function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return data ? JSON.parse(data) : [];
}

/**
 * お気に入りに日付を追加
 * @param date - 日付（ISO 8601形式）
 */
export function addFavorite(date: string): void {
  const favorites = loadFavorites();
  if (!favorites.includes(date)) {
    favorites.push(date);
    saveFavorites(favorites);
  }
}

/**
 * お気に入りから日付を削除
 * @param date - 日付（ISO 8601形式）
 */
export function removeFavorite(date: string): void {
  const favorites = loadFavorites();
  const filtered = favorites.filter(d => d !== date);
  saveFavorites(filtered);
}

/**
 * 日付がお気に入りかチェック
 * @param date - 日付（ISO 8601形式）
 * @returns お気に入りかどうか
 */
export function isFavorite(date: string): boolean {
  return loadFavorites().includes(date);
}

/**
 * 履歴を保存
 * @param history - 履歴の配列
 */
export function saveHistory(history: MoonHistory[]): void {
  if (typeof window === 'undefined') return;
  // 最新10件のみ保存
  const limited = history.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limited));
}

/**
 * 履歴を読み込み
 * @returns 履歴の配列
 */
export function loadHistory(): MoonHistory[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      viewedAt: new Date(item.viewedAt),
    }));
  } catch {
    return [];
  }
}

/**
 * 履歴に日付を追加
 * @param date - 日付（ISO 8601形式）
 * @param moonAge - 月齢
 * @param phaseName - 月の名称
 */
export function addHistory(date: string, moonAge: number, phaseName: string): void {
  const history = loadHistory();

  // 既存のエントリを削除（重複を避ける）
  const filtered = history.filter(h => h.date !== date);

  // 新しいエントリを先頭に追加
  filtered.unshift({
    date,
    moonAge,
    phaseName,
    viewedAt: new Date(),
  });

  saveHistory(filtered);
}

/**
 * 全データをクリア
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
