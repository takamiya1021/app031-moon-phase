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
    const images = screen.getAllByRole('img');
    // Canvas と絵文字の2つの img role がある
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it('should display moon phase information', () => {
    render(<Home />);
    // 月齢と照度のラベルが存在することを確認
    const labels = screen.getAllByText(/^(月齢|照度)$/);
    expect(labels.length).toBeGreaterThanOrEqual(2); // 月齢と照度の2つ

    // 表示中の日付も確認
    const dateLabel = screen.getByText(/表示中の日付/);
    expect(dateLabel).toBeInTheDocument();
  });

  it('should display date selector', () => {
    render(<Home />);
    const dateInput = screen.getByLabelText(/日付を選択/i);
    expect(dateInput).toBeInTheDocument();
  });

  it('should display moon info component', () => {
    render(<Home />);
    const displayDate = screen.getByText(/表示中の日付/);
    expect(displayDate).toBeInTheDocument();
  });
});
