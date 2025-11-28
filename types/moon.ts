/**
 * 月の満ち欠けに関する型定義
 */

export interface MoonPhaseData {
  date: Date;
  moonAge: number;        // 0-29.53日
  phaseName: string;      // '新月', '上弦', '満月', '下弦'等
  illumination: number;   // 0-1 (0=新月, 1=満月)
}

/**
 * AIが生成したコンテンツ
 */
export interface AIContent {
  trivia: string; // 豆知識
  observation: string; // 観測アドバイス
  bodyCycle: string; // 心と体のサイクル（新規）
  message: string; // 今日のメッセージ
  generatedAt: Date; // 生成日時
}

export interface MoonHistory {
  date: string;           // ISO 8601形式
  moonAge: number;
  phaseName: string;
  viewedAt: Date;
}

export interface AppSettings {
  apiKey?: string;
  favoritesDates: string[];
  history: MoonHistory[];
}
