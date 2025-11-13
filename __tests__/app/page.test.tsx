/**
 * ホームページのテスト - Phase 0-4
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
});
