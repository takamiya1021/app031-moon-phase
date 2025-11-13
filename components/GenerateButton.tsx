/**
 * GenerateButton コンポーネント - Phase 4-5
 * AI情報生成ボタン
 */

'use client';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function GenerateButton({ onClick, isLoading, disabled = false }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        w-full max-w-md px-6 py-4 rounded-lg font-semibold text-lg
        transition-all duration-200
        ${
          isLoading || disabled
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
  );
}
