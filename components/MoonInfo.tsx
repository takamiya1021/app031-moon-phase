/**
 * MoonInfo コンポーネント - Phase 3-3
 * 月齢・名称・照度を表示
 */

'use client';

import type { MoonPhaseData } from '@/types/moon';

interface MoonInfoProps {
  moonPhaseData: MoonPhaseData;
}

export default function MoonInfo({ moonPhaseData }: MoonInfoProps) {
  // 月の絵文字を名称に応じて返す
  const getMoonEmoji = (phaseName: string): string => {
    if (phaseName.includes('新月')) return '🌑';
    if (phaseName.includes('三日月')) return '🌒';
    if (phaseName.includes('上弦')) return '🌓';
    if (phaseName.includes('十三夜')) return '🌔';
    if (phaseName.includes('満月')) return '🌕';
    if (phaseName.includes('寝待月')) return '🌖';
    if (phaseName.includes('下弦')) return '🌗';
    if (phaseName.includes('有明月')) return '🌘';
    return '🌙';
  };

  // 日付をフォーマット
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];

    return `${year}年${month}月${day}日（${weekday}）`;
  };

  return (
    <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      {/* 日付 */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">表示中の日付</p>
        <p className="text-lg text-slate-200 font-medium">
          {formatDate(moonPhaseData.date)}
        </p>
      </div>

      <div className="border-t border-slate-700"></div>

      {/* 月の名称 */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-2">月の満ち欠け</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl" role="img" aria-label={moonPhaseData.phaseName}>
            {getMoonEmoji(moonPhaseData.phaseName)}
          </span>
          <p className="text-3xl font-bold text-slate-100">
            {moonPhaseData.phaseName}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700"></div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">月齢</p>
          <p className="text-2xl font-semibold text-blue-400">
            {moonPhaseData.moonAge.toFixed(1)}
          </p>
          <p className="text-xs text-slate-500">日</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">照度</p>
          <p className="text-2xl font-semibold text-yellow-400">
            {(moonPhaseData.illumination * 100).toFixed(0)}
          </p>
          <p className="text-xs text-slate-500">%</p>
        </div>
      </div>
    </div>
  );
}
