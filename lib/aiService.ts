/**
 * AIサービス - Phase 4-2 (Green)
 * Google AI Studio API統合（環境変数がない場合はダミーデータを返す）
 */

import type { AIContent } from '@/types/moon';

/**
 * AIレスポンスをパースして構造化データに変換
 * @param text - AIからのレスポンステキスト
 * @returns 構造化されたAIコンテンツ
 */
export function parseAIResponse(text: string): AIContent {
  // セクションを抽出する正規表現
  const triviaMatch = text.match(/【豆知識】\s*([\s\S]*?)(?=【|$)/);
  const messageMatch = text.match(/【運勢メッセージ】\s*([\s\S]*?)(?=【|$)/);
  const observationMatch = text.match(/【観測アドバイス】\s*([\s\S]*?)(?=【|$)/);

  return {
    trivia: triviaMatch ? triviaMatch[1].trim() : text.substring(0, 200) || 'データを取得できませんでした。',
    message: messageMatch ? messageMatch[1].trim() : 'データを取得できませんでした。',
    observation: observationMatch ? observationMatch[1].trim() : 'データを取得できませんでした。',
    generatedAt: new Date(),
  };
}

/**
 * ダミーコンテンツを生成（APIキーが設定されていない場合）
 * @param date - 日付
 * @param moonAge - 月齢
 * @param phaseName - 月の名称
 * @returns ダミーのAIコンテンツ
 */
function generateDummyContent(
  date: string,
  moonAge: number,
  phaseName: string
): AIContent {
  const triviaExamples = [
    `${phaseName}は月の満ち欠けの重要な時期です。月は地球の唯一の天然衛星で、約27.3日で地球の周りを一周します。`,
    `月齢${moonAge.toFixed(1)}日の月は、太陽・地球・月の位置関係によって、このような姿を見せています。`,
    `${phaseName}の時期は、古来より様々な文化で特別な意味を持つとされてきました。`,
  ];

  const messageExamples = [
    `${phaseName}の時期は、新しいことを始めるのに適した時期です。月のエネルギーを感じながら、ゆっくりと過ごしましょう。`,
    `今日は${phaseName}。心を落ち着けて、自分自身と向き合う時間を持つと良いでしょう。`,
    `${phaseName}のエネルギーは、前向きな変化をもたらします。今日一日を大切に過ごしてください。`,
  ];

  const observationExamples = [
    `${phaseName}は夜空でよく見えます。天気が良ければ、ぜひ夜空を見上げてみてください。`,
    `月の観測は日没後や明け方が適しています。双眼鏡があると、より詳細に観察できます。`,
    `今日の月齢は${moonAge.toFixed(1)}日です。晴れた日には、月の表面の模様も観察できるかもしれません。`,
  ];

  return {
    trivia: triviaExamples[Math.floor(Math.random() * triviaExamples.length)],
    message: messageExamples[Math.floor(Math.random() * messageExamples.length)],
    observation: observationExamples[Math.floor(Math.random() * observationExamples.length)],
    generatedAt: new Date(),
  };
}

/**
 * 月にまつわるコンテンツをAIで生成
 * @param date - 日付
 * @param moonAge - 月齢
 * @param phaseName - 月の名称
 * @returns AIが生成したコンテンツ
 */
export async function generateMoonContent(
  date: string,
  moonAge: number,
  phaseName: string
): Promise<AIContent> {
  // ローカルストレージからAPIキーを取得
  let apiKey: string | null = null;

  if (typeof window !== 'undefined') {
    apiKey = localStorage.getItem('moon-app-api-key');
  }

  // デバッグログ
  console.log('AI Service Debug:', {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    isDefaultKey: apiKey === 'your-api-key-here',
    isEmpty: apiKey === '',
  });

  // APIキーが設定されていない場合はダミーデータを返す
  if (!apiKey || apiKey === 'your-api-key-here' || apiKey === '') {
    console.log('Google AI API key not configured. Using dummy data.');
    // 少し遅延を入れてAPIっぽく見せる
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDummyContent(date, moonAge, phaseName);
  }

  try {
    console.log('Calling Google AI API...');

    // Google AI Studio APIを使用（gemini-2.5-flashを使用）
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `日付: ${date}
月齢: ${moonAge.toFixed(1)}日
月の名称: ${phaseName}

以下の3つのセクションで、月にまつわる情報を生成してください：

【豆知識】
その日の月に関連する神話・文化・科学的知識を150文字程度で

【運勢メッセージ】
月の満ち欠けに合わせた癒し・前向きなメッセージを100文字程度で

【観測アドバイス】
月の観測に適した時間帯とヒントを100文字程度で`,
                },
              ],
            },
          ],
        }),
      }
    );

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error details:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response received:', data);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.warn('No text in API response, using dummy data');
      return generateDummyContent(date, moonAge, phaseName);
    }

    console.log('Successfully generated AI content');
    return parseAIResponse(text);
  } catch (error) {
    console.error('Error generating AI content:', error);
    // エラー時もダミーデータを返す
    return generateDummyContent(date, moonAge, phaseName);
  }
}
