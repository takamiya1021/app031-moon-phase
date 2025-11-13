/**
 * MoonCanvas コンポーネントのテスト - Phase 2-3 (Red)
 */

import { render, screen } from '@testing-library/react';
import MoonCanvas from '@/components/MoonCanvas';
import type { MoonPhaseData } from '@/types/moon';

describe('MoonCanvas', () => {
  const mockMoonPhaseData: MoonPhaseData = {
    date: new Date('2000-01-21T04:40:00Z'),
    moonAge: 14.8,
    phaseName: '満月',
    illumination: 1,
  };

  it('should render canvas element', () => {
    render(<MoonCanvas moonPhaseData={mockMoonPhaseData} />);

    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('should have correct canvas size', () => {
    render(<MoonCanvas moonPhaseData={mockMoonPhaseData} size={400} />);

    const canvas = screen.getByRole('img') as HTMLCanvasElement;
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(400);
  });

  it('should use default size if not provided', () => {
    render(<MoonCanvas moonPhaseData={mockMoonPhaseData} />);

    const canvas = screen.getByRole('img') as HTMLCanvasElement;
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it('should have accessible label', () => {
    render(<MoonCanvas moonPhaseData={mockMoonPhaseData} />);

    const canvas = screen.getByRole('img');
    expect(canvas).toHaveAttribute('aria-label');
    expect(canvas.getAttribute('aria-label')).toContain('満月');
  });

  it('should update when moon phase data changes', () => {
    const { rerender } = render(<MoonCanvas moonPhaseData={mockMoonPhaseData} />);

    const newMoonPhaseData: MoonPhaseData = {
      date: new Date('2000-01-06T18:14:00Z'),
      moonAge: 0,
      phaseName: '新月',
      illumination: 0,
    };

    rerender(<MoonCanvas moonPhaseData={newMoonPhaseData} />);

    const canvas = screen.getByRole('img');
    expect(canvas.getAttribute('aria-label')).toContain('新月');
  });
});
