'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import MoonCanvas from '@/components/MoonCanvas';
import DateSelector from '@/components/DateSelector';
import MoonInfo from '@/components/MoonInfo';
import GenerateButton from '@/components/GenerateButton';
import AIContentSection from '@/components/AIContentSection';
import { addHistory } from '@/lib/storage';

export default function Home() {
  const { moonPhaseData, setDate } = useMoonPhase();
  const { aiContent, isLoading, error, generate } = useAIGeneration();

  // 日付が変更されたら履歴に追加
  useEffect(() => {
    const dateString = moonPhaseData.date.toISOString().split('T')[0];
    addHistory(dateString, moonPhaseData.moonAge, moonPhaseData.phaseName);
  }, [moonPhaseData.date, moonPhaseData.moonAge, moonPhaseData.phaseName]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8 py-12">
      {/* ナビゲーション */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <Link
          href="/settings"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white transition-colors flex items-center gap-2"
        >
          ⚙️ 設定
        </Link>
      </div>

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

      {/* AI生成ボタン */}
      <div className="w-full flex justify-center mt-8">
        <GenerateButton
          onClick={() => generate(moonPhaseData)}
          isLoading={isLoading}
        />
      </div>

      {/* AI生成コンテンツ */}
      <AIContentSection content={aiContent} isLoading={isLoading} error={error} />

      {/* フッター */}
      <div className="text-center text-sm text-slate-500 mt-8">
        <p>月齢計算範囲: 1925年〜2125年</p>
      </div>
    </main>
  );
}
