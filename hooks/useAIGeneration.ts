/**
 * useAIGeneration カスタムフック - Phase 4-3
 * AI生成の状態管理
 */

'use client';

import { useState, useCallback } from 'react';
import { generateMoonContent } from '@/lib/aiService';
import type { AIContent, MoonPhaseData } from '@/types/moon';

export function useAIGeneration() {
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI生成を実行
  const generate = useCallback(async (moonPhaseData: MoonPhaseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const dateString = moonPhaseData.date.toISOString().split('T')[0];
      const content = await generateMoonContent(
        dateString,
        moonPhaseData.moonAge,
        moonPhaseData.phaseName
      );

      setAiContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成に失敗しました');
      console.error('AI generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // コンテンツをクリア
  const clear = useCallback(() => {
    setAiContent(null);
    setError(null);
  }, []);

  return {
    aiContent,
    isLoading,
    error,
    generate,
    clear,
  };
}
