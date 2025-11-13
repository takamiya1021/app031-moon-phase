/**
 * Canvas Mock テスト - Phase 0-4
 * jest-canvas-mockが正しく動作することを確認
 */

describe('Canvas Mock Test', () => {
  it('should mock canvas 2d context', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    expect(ctx).toBeTruthy();
    expect(ctx?.fillRect).toBeDefined();
    expect(ctx?.arc).toBeDefined();
  });

  it('should allow drawing operations', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 100, 100);
      ctx.arc(50, 50, 30, 0, 2 * Math.PI);

      // Mockなので実際の描画は行われないが、エラーは発生しない
      expect(ctx.fillStyle).toBe('#ffffff');
    }
  });
});
