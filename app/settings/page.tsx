/**
 * 設定画面 - Phase 5-2
 * APIキー設定、データクリア
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadApiKey, saveApiKey, clearAllData } from '@/lib/storage';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = loadApiKey();
    if (key) setApiKey(key);
  }, []);

  const handleSave = () => {
    saveApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    if (confirm('全てのデータをクリアしますか？（APIキー、履歴、お気に入り）')) {
      clearAllData();
      setApiKey('');
      alert('データをクリアしました');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8 py-12">
      <div className="w-full max-w-2xl">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← 戻る
          </Link>
          <h1 className="text-3xl font-bold">⚙️ 設定</h1>
        </div>

        {/* APIキー設定 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Google AI API キー</h2>
          <p className="text-sm text-slate-400 mb-4">
            AI情報生成機能を使用するには、Google AI Studio APIキーが必要です。
            <br />
            APIキーがない場合は、ダミーデータが表示されます。
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                APIキー
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                {saved ? '✓ 保存しました' : '保存'}
              </button>
              <button
                onClick={() => setApiKey('')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              >
                クリア
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            APIキーの取得方法:{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Google AI Studio
            </a>
          </p>
        </div>

        {/* データ管理 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">データ管理</h2>

          <button
            onClick={handleClear}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
          >
            全データをクリア
          </button>

          <p className="text-xs text-slate-500 mt-2">
            APIキー、履歴、お気に入りが削除されます
          </p>
        </div>

        {/* アプリ情報 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">アプリ情報</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>名前:</strong> 月の満ち欠け表示</p>
            <p><strong>バージョン:</strong> 1.0.0</p>
            <p><strong>月齢計算範囲:</strong> 1925年〜2125年</p>
          </div>
        </div>
      </div>
    </main>
  );
}
