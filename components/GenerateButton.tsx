/**
 * GenerateButton コンポーネント - Phase 4-5
 * AI情報生成ボタン
 */

'use client';

import { useEffect, useState } from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function GenerateButton({ onClick, isLoading, disabled = false }: GenerateButtonProps) {
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    // APIキーの有無をチェック
    const apiKey = localStorage.getItem('moon-app-api-key');
    setHasApiKey(!!apiKey && apiKey !== '' && apiKey !== 'your-api-key-here');
  }, []);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`
          w-full px-6 py-4 rounded-lg font-semibold text-lg
          transition-all duration-200
          ${isLoading || disabled
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            生成中...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ AI情報を生成
          </span>
        )}
      </button>

      {!hasApiKey && (
        <p className="text-sm text-amber-400/90 text-center">
          ⚠️ APIキーが設定されていないため、デフォルトのダミーデータが表示されます
        </p>
      )}
    </div>
  );
}
