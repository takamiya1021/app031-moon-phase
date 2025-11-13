/**
 * サンプルテスト - Phase 0-4
 * Jest環境が正しく動作することを確認
 */

describe('Sample Test Suite', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const str = 'Moon Phase Viewer';
    expect(str).toContain('Moon');
    expect(str).toHaveLength(17);
  });

  it('should work with arrays', () => {
    const phases = ['新月', '上弦', '満月', '下弦'];
    expect(phases).toHaveLength(4);
    expect(phases).toContain('満月');
  });
});
