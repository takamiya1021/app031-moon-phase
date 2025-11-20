import { computeSunDirection, computeSunPosition, SYNODIC_MONTH } from '@/lib/moonLighting';

describe('moonLighting utilities', () => {
  it('computes sun direction for new moon (backs the viewer)', () => {
    const dir = computeSunDirection(0);
    expect(dir[2]).toBeCloseTo(-1, 2);
  });

  it('computes sun direction for full moon (towards the viewer)', () => {
    const dir = computeSunDirection(SYNODIC_MONTH / 2);
    expect(dir[2]).toBeCloseTo(1, 2);
  });

  it('computes sun direction for first quarter (lights from the right)', () => {
    const dir = computeSunDirection(SYNODIC_MONTH / 4);
    expect(dir[0]).toBeGreaterThan(0.9);
    expect(Math.abs(dir[2])).toBeLessThan(0.1);
  });

  it('computes sun direction for last quarter (lights from the left)', () => {
    const dir = computeSunDirection((SYNODIC_MONTH * 3) / 4);
    expect(dir[0]).toBeLessThan(-0.9);
    expect(Math.abs(dir[2])).toBeLessThan(0.1);
  });

  it('returns scaled sun position', () => {
    const pos = computeSunPosition(SYNODIC_MONTH / 2, 10);
    expect(pos[2]).toBeCloseTo(10, 5);
  });
});
