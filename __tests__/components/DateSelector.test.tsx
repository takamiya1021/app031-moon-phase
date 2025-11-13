/**
 * DateSelector コンポーネントのテスト - Phase 3-1 (Red)
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateSelector from '@/components/DateSelector';

describe('DateSelector', () => {
  const mockOnDateChange = jest.fn();
  const testDate = new Date('2025-01-13T00:00:00Z');

  beforeEach(() => {
    mockOnDateChange.mockClear();
  });

  it('should render date input', () => {
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const dateInput = screen.getByLabelText(/日付を選択/i);
    expect(dateInput).toBeInTheDocument();
  });

  it('should display current date', () => {
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const dateInput = screen.getByLabelText(/日付を選択/i) as HTMLInputElement;
    expect(dateInput.value).toBe('2025-01-13');
  });

  it('should have previous day button', () => {
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const prevButton = screen.getByRole('button', { name: /前日/i });
    expect(prevButton).toBeInTheDocument();
  });

  it('should have next day button', () => {
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const nextButton = screen.getByRole('button', { name: /翌日/i });
    expect(nextButton).toBeInTheDocument();
  });

  it('should have today button', () => {
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const todayButton = screen.getByRole('button', { name: /今日/i });
    expect(todayButton).toBeInTheDocument();
  });

  it('should call onDateChange when previous day button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const prevButton = screen.getByRole('button', { name: /前日/i });
    await user.click(prevButton);

    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnDateChange.mock.calls[0][0] as Date;
    expect(calledDate.getDate()).toBe(12); // 1日前
  });

  it('should call onDateChange when next day button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const nextButton = screen.getByRole('button', { name: /翌日/i });
    await user.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnDateChange.mock.calls[0][0] as Date;
    expect(calledDate.getDate()).toBe(14); // 1日後
  });

  it('should call onDateChange when today button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const todayButton = screen.getByRole('button', { name: /今日/i });
    await user.click(todayButton);

    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnDateChange.mock.calls[0][0] as Date;

    // 今日の日付であることを確認（時間は無視）
    const today = new Date();
    expect(calledDate.getFullYear()).toBe(today.getFullYear());
    expect(calledDate.getMonth()).toBe(today.getMonth());
    expect(calledDate.getDate()).toBe(today.getDate());
  });

  it('should call onDateChange when date input is changed', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const dateInput = screen.getByLabelText(/日付を選択/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2025-02-14');

    expect(mockOnDateChange).toHaveBeenCalled();
  });

  it('should not allow dates before 1925', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const dateInput = screen.getByLabelText(/日付を選択/i) as HTMLInputElement;
    expect(dateInput.min).toBe('1925-01-01');
  });

  it('should not allow dates after 2125', async () => {
    const user = userEvent.setup();
    render(<DateSelector date={testDate} onDateChange={mockOnDateChange} />);

    const dateInput = screen.getByLabelText(/日付を選択/i) as HTMLInputElement;
    expect(dateInput.max).toBe('2125-12-31');
  });
});
