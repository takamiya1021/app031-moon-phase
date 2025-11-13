/**
 * ホームページのテスト - Phase 0-4 (Updated)
 * React Testing Libraryが正しく動作することを確認
 */

import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('should render the title', () => {
    render(<Home />);
    const heading = screen.getByText(/月の満ち欠け表示/i);
    expect(heading).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Home />);
    const subtitle = screen.getByText(/Moon Phase Viewer/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('should render moon canvas', () => {
    render(<Home />);
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  it('should display moon phase information', () => {
    render(<Home />);
    // 月齢の表示を確認
    const moonAgeText = screen.getByText(/月齢:/);
    expect(moonAgeText).toBeInTheDocument();

    // 照度の表示を確認
    const illuminationText = screen.getByText(/照度:/);
    expect(illuminationText).toBeInTheDocument();
  });
});
