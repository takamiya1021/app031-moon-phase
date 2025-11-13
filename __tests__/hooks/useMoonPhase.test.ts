/**
 * useMoonPhase カスタムフックのテスト - Phase 1-4 (Red)
 */

import { renderHook, act } from '@testing-library/react';
import { useMoonPhase } from '@/hooks/useMoonPhase';

describe('useMoonPhase', () => {
  it('should return moon phase data for today by default', () => {
    const { result } = renderHook(() => useMoonPhase());

    expect(result.current.moonPhaseData).toBeDefined();
    expect(result.current.moonPhaseData.moonAge).toBeGreaterThanOrEqual(0);
    expect(result.current.moonPhaseData.moonAge).toBeLessThan(29.53058867);
    expect(result.current.moonPhaseData.phaseName).toBeTruthy();
    expect(result.current.moonPhaseData.illumination).toBeGreaterThanOrEqual(0);
    expect(result.current.moonPhaseData.illumination).toBeLessThanOrEqual(1);
  });

  it('should return moon phase data for a specific date', () => {
    const testDate = new Date('2000-01-21T04:40:00Z'); // 満月

    const { result } = renderHook(() => useMoonPhase(testDate));

    expect(result.current.moonPhaseData.date).toEqual(testDate);
    expect(result.current.moonPhaseData.phaseName).toBe('満月');
    expect(result.current.moonPhaseData.moonAge).toBeGreaterThan(14);
    expect(result.current.moonPhaseData.moonAge).toBeLessThan(15.5);
  });

  it('should update moon phase data when date changes', () => {
    const initialDate = new Date('2000-01-06T18:14:00Z'); // 新月
    const { result, rerender } = renderHook(
      ({ date }) => useMoonPhase(date),
      { initialProps: { date: initialDate } }
    );

    // 初期状態: 新月
    expect(result.current.moonPhaseData.phaseName).toBe('新月');

    // 日付を変更: 満月
    const newDate = new Date('2000-01-21T04:40:00Z');
    rerender({ date: newDate });

    // 更新後: 満月
    expect(result.current.moonPhaseData.phaseName).toBe('満月');
    expect(result.current.moonPhaseData.date).toEqual(newDate);
  });

  it('should provide setDate function to update date', () => {
    const { result } = renderHook(() => useMoonPhase());

    expect(result.current.setDate).toBeDefined();
    expect(typeof result.current.setDate).toBe('function');

    act(() => {
      result.current.setDate(new Date('2000-01-14T12:00:00Z')); // 上弦
    });

    expect(result.current.moonPhaseData.phaseName).toBe('上弦');
  });

  it('should handle invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');

    const { result } = renderHook(() => useMoonPhase(invalidDate));

    // NaNが返ることを確認（エラーをスローしない）
    expect(result.current.moonPhaseData.moonAge).toBeNaN();
  });
});
