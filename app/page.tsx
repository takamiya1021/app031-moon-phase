'use client';

import { useMoonPhase } from '@/hooks/useMoonPhase';
import MoonCanvas from '@/components/MoonCanvas';

export default function Home() {
  const { moonPhaseData } = useMoonPhase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🌙 月の満ち欠け表示</h1>
        <p className="text-xl text-slate-300 mb-2">
          Moon Phase Viewer
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <MoonCanvas moonPhaseData={moonPhaseData} size={400} />

        <div className="text-center space-y-2">
          <p className="text-2xl font-semibold text-slate-100">
            {moonPhaseData.phaseName}
          </p>
          <p className="text-lg text-slate-300">
            月齢: {moonPhaseData.moonAge.toFixed(1)}日
          </p>
          <p className="text-sm text-slate-400">
            照度: {(moonPhaseData.illumination * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </main>
  );
}
