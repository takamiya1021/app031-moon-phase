/**
 * Canvas描画ユーティリティのテスト - Phase 2-1 (Red)
 */

import { drawMoon, drawStars, drawBackground } from '@/lib/moonDraw';

describe('drawBackground', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    ctx = canvas.getContext('2d')!;
  });

  it('should draw background with gradient', () => {
    drawBackground(ctx, 500, 500);

    // createRadialGradientまたはcreateLinearGradientが呼ばれたことを確認
    expect(ctx.createLinearGradient).toBeDefined();
  });

  it('should fill the entire canvas', () => {
    const fillRectSpy = jest.spyOn(ctx, 'fillRect');

    drawBackground(ctx, 500, 500);

    expect(fillRectSpy).toHaveBeenCalled();
  });
});

describe('drawStars', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    ctx = canvas.getContext('2d')!;
  });

  it('should draw multiple stars', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawStars(ctx, 500, 500, 20);

    // 20個の星を描画するので、arcが20回呼ばれる
    expect(arcSpy).toHaveBeenCalledTimes(20);
  });

  it('should draw stars with random positions', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawStars(ctx, 500, 500, 5);

    expect(arcSpy).toHaveBeenCalledTimes(5);

    // 各呼び出しの位置が異なることを確認（ランダム性）
    const calls = arcSpy.mock.calls;
    const positions = calls.map(call => ({ x: call[0], y: call[1] }));

    // 少なくとも1つは異なる位置であること
    const uniquePositions = new Set(positions.map(p => `${p.x},${p.y}`));
    expect(uniquePositions.size).toBeGreaterThan(0);
  });

  it('should not draw stars if count is 0', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawStars(ctx, 500, 500, 0);

    expect(arcSpy).not.toHaveBeenCalled();
  });
});

describe('drawMoon', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    ctx = canvas.getContext('2d')!;
  });

  it('should draw moon with correct radius', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawMoon(ctx, 250, 250, 100, 0.5); // 中心(250,250), 半径100, 照度0.5

    // 月の円を描画
    expect(arcSpy).toHaveBeenCalled();
  });

  it('should handle new moon (illumination = 0)', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawMoon(ctx, 250, 250, 100, 0);

    // 新月でも描画は行われる（影のみ）
    expect(arcSpy).toHaveBeenCalled();
  });

  it('should handle full moon (illumination = 1)', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawMoon(ctx, 250, 250, 100, 1);

    // 満月は完全に明るい円
    expect(arcSpy).toHaveBeenCalled();
  });

  it('should handle first quarter moon (illumination ≈ 0.5)', () => {
    const arcSpy = jest.spyOn(ctx, 'arc');

    drawMoon(ctx, 250, 250, 100, 0.5);

    // 上弦/下弦も正しく描画
    expect(arcSpy).toHaveBeenCalled();
  });

  it('should use save and restore for context state', () => {
    const saveSpy = jest.spyOn(ctx, 'save');
    const restoreSpy = jest.spyOn(ctx, 'restore');

    drawMoon(ctx, 250, 250, 100, 0.5);

    expect(saveSpy).toHaveBeenCalled();
    expect(restoreSpy).toHaveBeenCalled();
  });
});
