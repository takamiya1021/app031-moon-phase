'use client';

import { useMoonPhase } from '@/hooks/useMoonPhase';
import MoonCanvas from '@/components/MoonCanvas';
import DateSelector from '@/components/DateSelector';
import MoonInfo from '@/components/MoonInfo';

export default function Home() {
  const { moonPhaseData, setDate } = useMoonPhase();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8 py-12">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🌙 月の満ち欠け表示</h1>
        <p className="text-xl text-slate-300">
          Moon Phase Viewer
        </p>
      </div>

      {/* 日付選択 */}
      <div className="w-full max-w-md">
        <DateSelector date={moonPhaseData.date} onDateChange={setDate} />
      </div>

      {/* 月の表示 */}
      <div className="flex flex-col items-center gap-6">
        <MoonCanvas moonPhaseData={moonPhaseData} size={400} />
        <MoonInfo moonPhaseData={moonPhaseData} />
      </div>

      {/* フッター */}
      <div className="text-center text-sm text-slate-500 mt-8">
        <p>月齢計算範囲: 1925年〜2125年</p>
      </div>
    </main>
  );
}
