/**
 * DateSelector コンポーネント - Phase 3-2 (Green)
 * 日付選択と前後の日への移動機能
 */

'use client';

import { useState, useEffect } from 'react';

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

// 日付をYYYY-MM-DD形式に変換
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD形式の文字列をDateオブジェクトに変換
function parseInputDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function DateSelector({ date, onDateChange }: DateSelectorProps) {
  const [inputValue, setInputValue] = useState(formatDateForInput(date));

  // propsのdateが変更されたらinputValueも更新
  useEffect(() => {
    setInputValue(formatDateForInput(date));
  }, [date]);

  // 前日に移動
  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  // 翌日に移動
  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  // 今日に移動
  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻をリセット
    onDateChange(today);
  };

  // 日付入力の変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 有効な日付の場合のみonDateChangeを呼ぶ
    if (newValue) {
      const newDate = parseInputDate(newValue);
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* 日付入力 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="date-input" className="text-sm font-medium text-slate-300">
          日付を選択
        </label>
        <input
          id="date-input"
          type="date"
          value={inputValue}
          onChange={handleInputChange}
          min="1925-01-01"
          max="2125-12-31"
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex gap-2 justify-between">
        <button
          onClick={handlePreviousDay}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white transition-colors"
          aria-label="前日"
        >
          ◀ 前日
        </button>

        <button
          onClick={handleToday}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-lg text-white transition-colors font-medium"
          aria-label="今日"
        >
          今日
        </button>

        <button
          onClick={handleNextDay}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white transition-colors"
          aria-label="翌日"
        >
          翌日 ▶
        </button>
      </div>
    </div>
  );
}
