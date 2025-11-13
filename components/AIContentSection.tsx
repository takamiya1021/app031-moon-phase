/**
 * AIContentSection コンポーネント - Phase 4-4
 * AI生成コンテンツの表示
 */

'use client';

import type { AIContent } from '@/types/moon';

interface AIContentSectionProps {
  content: AIContent | null;
  isLoading: boolean;
  error: string | null;
}

export default function AIContentSection({ content, isLoading, error }: AIContentSectionProps) {
  // ローディング中
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-slate-300">AI情報を生成中...</p>
          </div>
        </div>
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-400">
            <span>⚠️</span>
            <p>エラー: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // コンテンツがない
  if (!content) {
    return null;
  }

  // コンテンツ表示
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* 豆知識 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-slate-200">豆知識</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{content.trivia}</p>
      </div>

      {/* 運勢メッセージ */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔮</span>
          <h3 className="text-lg font-semibold text-slate-200">今日のメッセージ</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{content.message}</p>
      </div>

      {/* 観測アドバイス */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔭</span>
          <h3 className="text-lg font-semibold text-slate-200">観測アドバイス</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{content.observation}</p>
      </div>

      {/* 生成日時 */}
      <div className="text-center text-xs text-slate-500">
        生成日時: {content.generatedAt.toLocaleString('ja-JP')}
      </div>
    </div>
  );
}
