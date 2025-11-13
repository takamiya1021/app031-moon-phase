/**
 * 月齢計算ロジックのテスト - Phase 1-1 (Red)
 * TDDサイクル: まずテストを書いて失敗することを確認
 */

import { calculateMoonAge, getMoonPhaseName, getMoonIllumination } from '@/lib/moonPhase';

describe('calculateMoonAge', () => {
  it('should calculate moon age for the reference new moon date', () => {
    // 基準日: 2000年1月6日 18:14 UTC（新月）
    const date = new Date('2000-01-06T18:14:00Z');
    const moonAge = calculateMoonAge(date);

    // 新月なので月齢は0に近いはず（完全に0ではないかもしれないが、0.1以下）
    expect(moonAge).toBeGreaterThanOrEqual(0);
    expect(moonAge).toBeLessThan(0.1);
  });

  it('should calculate moon age for first quarter moon', () => {
    // 2000年1月14日頃: 上弦の月（月齢約7.4日）
    const date = new Date('2000-01-14T12:00:00Z');
    const moonAge = calculateMoonAge(date);

    // 上弦の月は月齢7.4日前後
    expect(moonAge).toBeGreaterThan(7);
    expect(moonAge).toBeLessThan(8);
  });

  it('should calculate moon age for full moon', () => {
    // 2000年1月21日頃: 満月（月齢約14.8日）
    const date = new Date('2000-01-21T04:40:00Z');
    const moonAge = calculateMoonAge(date);

    // 満月は月齢14.8日前後
    expect(moonAge).toBeGreaterThan(14);
    expect(moonAge).toBeLessThan(15.5);
  });

  it('should calculate moon age for last quarter moon', () => {
    // 2000年1月28日頃: 下弦の月（月齢約22.1日）
    const date = new Date('2000-01-28T12:00:00Z');
    const moonAge = calculateMoonAge(date);

    // 下弦の月は月齢22.1日前後
    expect(moonAge).toBeGreaterThan(21);
    expect(moonAge).toBeLessThan(23);
  });

  it('should handle dates in the past (1925)', () => {
    // エッジケース: 1925年1月1日
    const date = new Date('1925-01-01T00:00:00Z');
    const moonAge = calculateMoonAge(date);

    // 月齢は0〜29.53の範囲内
    expect(moonAge).toBeGreaterThanOrEqual(0);
    expect(moonAge).toBeLessThan(29.53058867);
  });

  it('should handle dates in the future (2125)', () => {
    // エッジケース: 2125年12月31日
    const date = new Date('2125-12-31T23:59:59Z');
    const moonAge = calculateMoonAge(date);

    // 月齢は0〜29.53の範囲内
    expect(moonAge).toBeGreaterThanOrEqual(0);
    expect(moonAge).toBeLessThan(29.53058867);
  });

  it('should handle current date (2025)', () => {
    // 現在の日付でもエラーが出ないこと
    const date = new Date('2025-01-13T00:00:00Z');
    const moonAge = calculateMoonAge(date);

    expect(moonAge).toBeGreaterThanOrEqual(0);
    expect(moonAge).toBeLessThan(29.53058867);
  });
});

describe('getMoonPhaseName', () => {
  it('should return "新月" for moon age 0-1.84', () => {
    expect(getMoonPhaseName(0)).toBe('新月');
    expect(getMoonPhaseName(1.0)).toBe('新月');
    expect(getMoonPhaseName(1.83)).toBe('新月');
  });

  it('should return "三日月" for moon age 1.84-5.53', () => {
    expect(getMoonPhaseName(1.84)).toBe('三日月');
    expect(getMoonPhaseName(3.5)).toBe('三日月');
    expect(getMoonPhaseName(5.52)).toBe('三日月');
  });

  it('should return "上弦" for moon age 5.53-9.22', () => {
    expect(getMoonPhaseName(5.53)).toBe('上弦');
    expect(getMoonPhaseName(7.4)).toBe('上弦');
    expect(getMoonPhaseName(9.21)).toBe('上弦');
  });

  it('should return "十三夜" for moon age 9.22-12.91', () => {
    expect(getMoonPhaseName(9.22)).toBe('十三夜');
    expect(getMoonPhaseName(11.0)).toBe('十三夜');
    expect(getMoonPhaseName(12.90)).toBe('十三夜');
  });

  it('should return "満月" for moon age 12.91-16.61', () => {
    expect(getMoonPhaseName(12.91)).toBe('満月');
    expect(getMoonPhaseName(14.8)).toBe('満月');
    expect(getMoonPhaseName(16.60)).toBe('満月');
  });

  it('should return "寝待月" for moon age 16.61-20.30', () => {
    expect(getMoonPhaseName(16.61)).toBe('寝待月');
    expect(getMoonPhaseName(18.0)).toBe('寝待月');
    expect(getMoonPhaseName(20.29)).toBe('寝待月');
  });

  it('should return "下弦" for moon age 20.30-23.99', () => {
    expect(getMoonPhaseName(20.30)).toBe('下弦');
    expect(getMoonPhaseName(22.1)).toBe('下弦');
    expect(getMoonPhaseName(23.98)).toBe('下弦');
  });

  it('should return "有明月" for moon age 23.99-27.68', () => {
    expect(getMoonPhaseName(23.99)).toBe('有明月');
    expect(getMoonPhaseName(25.5)).toBe('有明月');
    expect(getMoonPhaseName(27.67)).toBe('有明月');
  });

  it('should return "新月（前日）" for moon age 27.68-29.53', () => {
    expect(getMoonPhaseName(27.68)).toBe('新月（前日）');
    expect(getMoonPhaseName(28.5)).toBe('新月（前日）');
    expect(getMoonPhaseName(29.52)).toBe('新月（前日）');
  });
});

describe('getMoonIllumination', () => {
  it('should return 0 for new moon (moon age 0)', () => {
    const illumination = getMoonIllumination(0);
    expect(illumination).toBeCloseTo(0, 2);
  });

  it('should return ~0.5 for first quarter (moon age ~7.4)', () => {
    const illumination = getMoonIllumination(7.4);
    expect(illumination).toBeGreaterThan(0.4);
    expect(illumination).toBeLessThan(0.6);
  });

  it('should return 1 for full moon (moon age ~14.8)', () => {
    const illumination = getMoonIllumination(14.76);
    expect(illumination).toBeCloseTo(1, 1);
  });

  it('should return ~0.5 for last quarter (moon age ~22.1)', () => {
    const illumination = getMoonIllumination(22.1);
    expect(illumination).toBeGreaterThan(0.4);
    expect(illumination).toBeLessThan(0.6);
  });

  it('should return value between 0 and 1', () => {
    // ランダムな月齢でテスト
    const moonAges = [0, 5, 10, 15, 20, 25, 29.5];

    moonAges.forEach(moonAge => {
      const illumination = getMoonIllumination(moonAge);
      expect(illumination).toBeGreaterThanOrEqual(0);
      expect(illumination).toBeLessThanOrEqual(1);
    });
  });
});
