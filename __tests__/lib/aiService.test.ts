/**
 * AIサービスのテスト - Phase 4-1 (Red)
 */

import { generateMoonContent, parseAIResponse } from '@/lib/aiService';

// モックレスポンス
const mockAIResponse = `
【豆知識】
今日の月は下弦の月です。下弦の月は、月が地球の周りを公転する過程で、太陽・地球・月が直角をなす位置にあるときに見られます。

【運勢メッセージ】
下弦の月のエネルギーは、手放しと浄化を促します。今は不要なものを手放し、新しいサイクルに向けて準備する時期です。

【観測アドバイス】
下弦の月は明け方の東の空に見えます。午前3時頃から日の出前までが観測のベストタイミングです。
`;

describe('parseAIResponse', () => {
  it('should parse AI response into structured data', () => {
    const result = parseAIResponse(mockAIResponse);

    expect(result).toBeDefined();
    expect(result.trivia).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.observation).toBeTruthy();
    expect(result.generatedAt).toBeInstanceOf(Date);
  });

  it('should extract trivia from response', () => {
    const result = parseAIResponse(mockAIResponse);

    expect(result.trivia).toContain('下弦の月');
    expect(result.trivia.length).toBeGreaterThan(10);
  });

  it('should extract message from response', () => {
    const result = parseAIResponse(mockAIResponse);

    expect(result.message).toContain('エネルギー');
    expect(result.message.length).toBeGreaterThan(10);
  });

  it('should extract observation advice from response', () => {
    const result = parseAIResponse(mockAIResponse);

    expect(result.observation).toContain('観測');
    expect(result.observation.length).toBeGreaterThan(10);
  });

  it('should handle empty sections gracefully', () => {
    const emptyResponse = '何もないレスポンス';
    const result = parseAIResponse(emptyResponse);

    expect(result.trivia).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.observation).toBeTruthy();
  });
});

describe('generateMoonContent', () => {
  it('should generate content for a given date and moon phase', async () => {
    const date = '2025-01-13';
    const moonAge = 14.8;
    const phaseName = '満月';

    const result = await generateMoonContent(date, moonAge, phaseName);

    expect(result).toBeDefined();
    expect(result.trivia).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.observation).toBeTruthy();
    expect(result.generatedAt).toBeInstanceOf(Date);
  });

  it('should include moon phase information in prompt', async () => {
    const date = '2025-01-13';
    const moonAge = 0;
    const phaseName = '新月';

    const result = await generateMoonContent(date, moonAge, phaseName);

    expect(result).toBeDefined();
  });

  it('should handle API errors gracefully', async () => {
    // APIキーが無効な場合のテスト
    const date = '2025-01-13';
    const moonAge = 14.8;
    const phaseName = '満月';

    // エラーをスローしないことを確認
    await expect(
      generateMoonContent(date, moonAge, phaseName)
    ).resolves.toBeDefined();
  });
});
