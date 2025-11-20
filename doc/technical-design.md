# 🛠️ 技術設計書：No.31「月の満ち欠け表示」

**作成日**: 2025-01-13
**バージョン**: 1.0
**アプリ番号**: 31

---

## 1. 技術スタック

### 1.1 推奨構成
- **フレームワーク**: Next.js 14.x（App Router）
- **言語**: TypeScript 5.x
- **UI**: React 18.x
- **スタイリング**: Tailwind CSS v3
- **PWA**: next-pwa
- **AI API**: Google AI Studio (Gemini API)
- **天文計算**: SunCalc.js または自前実装
- **状態管理**: React Context API（小規模のため）
- **ローカルストレージ**: Web Storage API

### 1.2 開発ツール
- **リンター**: ESLint 8.x
- **フォーマッター**: Prettier
- **パッケージマネージャー**: npm または pnpm

---

## 2. アーキテクチャ設計

### 2.1 コンポーネント構成

```
app/
├── layout.tsx                  // ルートレイアウト（PWA設定含む）
├── page.tsx                    // メインページ
├── components/
│   ├── MoonCanvas.tsx          // 月のCanvas描画コンポーネント
│   ├── DateSelector.tsx        // カレンダー選択コンポーネント
│   ├── MoonInfo.tsx            // 月齢・名称表示コンポーネント
│   ├── AIContentSection.tsx    // AI生成コンテンツ表示
│   ├── GenerateButton.tsx      // AI生成ボタン
│   └── Navigation.tsx          // 28番アプリとの共通ナビゲーション
├── lib/
│   ├── moonPhase.ts            // 月齢計算ロジック
│   ├── moonDraw.ts             // Canvas描画ロジック
│   ├── aiService.ts            // Google AI Studio API統合
│   └── storage.ts              // ローカルストレージ管理
├── hooks/
│   ├── useMoonPhase.ts         // 月齢計算カスタムフック
│   └── useAIGeneration.ts      // AI生成カスタムフック
└── types/
    └── moon.ts                 // 型定義
```

### 2.2 データフロー

```
[DateSelector]
    ↓ 日付変更
[useMoonPhase] → 月齢計算 → [MoonCanvas] → Canvas描画
    ↓                          ↓
[MoonInfo]                  [背景の星描画]

[GenerateButton]
    ↓ クリック
[useAIGeneration] → Google AI API → [AIContentSection]
```

---

## 3. Canvas描画設計

### 3.1 MoonCanvas仕様

#### 3.1.1 基本設定
```typescript
interface MoonCanvasConfig {
  size: number;              // Canvasサイズ（画面幅の33%〜50%）
  moonRadius: number;        // 月の半径
  backgroundColor: string;   // 背景色（ダークモード）
  moonColor: string;         // 月の基本色（ファンタジー調）
  shadowColor: string;       // 影の色
}
```

#### 3.1.2 描画ロジック
1. **背景描画**
   - ダークグラデーション（深い青〜黒）
   - 明るい星のみランダム配置（20〜30個程度）
   - 星のサイズ：肉眼で見える明るさを模擬

2. **月の描画**
   - 円形ベース（白〜クリーム色、やや発光効果）
   - 月齢に応じた影の描画
   - グラデーション効果（立体感）

3. **月の満ち欠けアルゴリズム**
```typescript
// 月齢 0-29.5日のサイクル
// 0日: 新月（完全に暗い）
// 7.4日: 上弦（右半分が明るい）
// 14.8日: 満月（完全に明るい）
// 22.1日: 下弦（左半分が明るい）

function drawMoonPhase(ctx: CanvasRenderingContext2D, phase: number) {
  // phase: 0-1 (0=新月, 0.5=満月, 1=新月)
  const angle = phase * 2 * Math.PI;

  // 影の部分を描画（arc + clip）
  // 満ち欠けの方向（上弦/下弦）に応じて描画
}
```

#### 3.1.3 アニメーション
- 日付変更時：月の満ち欠けを0.5秒でスムーズに遷移
- requestAnimationFrame使用
- イージング関数：ease-in-out

---

## 4. 月齢計算

### 4.1 アルゴリズム

#### 4.1.1 基準日からの経過日数計算
```typescript
// 基準: 2000年1月6日 18:14 UTC（既知の新月）
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');
const LUNAR_CYCLE = 29.53058867; // 平均朔望月

function calculateMoonAge(date: Date): number {
  const diff = date.getTime() - KNOWN_NEW_MOON.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const moonAge = days % LUNAR_CYCLE;
  return moonAge >= 0 ? moonAge : moonAge + LUNAR_CYCLE;
}
```

#### 4.1.2 月の名称判定
```typescript
function getMoonPhaseName(moonAge: number): string {
  if (moonAge < 1.84) return '新月';
  if (moonAge < 5.53) return '三日月';
  if (moonAge < 9.22) return '上弦';
  if (moonAge < 12.91) return '十三夜';
  if (moonAge < 16.61) return '満月';
  if (moonAge < 20.30) return '寝待月';
  if (moonAge < 23.99) return '下弦';
  if (moonAge < 27.68) return '有明月';
  return '新月（前日）';
}
```

### 4.2 ±100年対応
- JavaScriptのDate範囲内（1970年〜2100年以上対応可能）
- 1925年〜2125年の範囲で正確な計算を保証

---

## 5. Google AI Studio API統合

### 5.1 API設定

#### 5.1.1 ローカルストレージ
```typescript
// APIキーはローカルストレージに保存
const API_KEY_STORAGE_KEY = 'moon-app-api-key';
localStorage.setItem(API_KEY_STORAGE_KEY, 'your-api-key-here');
```

#### 5.1.2 APIクライアント
```typescript
// lib/aiService.ts
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

  // APIキーが設定されていない場合はダミーデータを返す
  if (!apiKey) {
    return generateDummyContent(date, moonAge, phaseName);
  }

  // Google AI Studio APIを使用（gemini-2.5-flash）
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: /* プロンプト */ }]
        }]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseAIResponse(text);
}
```

### 5.2 プロンプト設計

#### 5.2.1 豆知識生成
```
あなたは天文学と神話に詳しい専門家です。
${date}の月（月齢${moonAge}日、${phaseName}）について、
興味深い豆知識を1つ、150文字程度で教えてください。
神話・文化・科学的知識から選んでください。
```

#### 5.2.2 運勢メッセージ
```
あなたは優しい占い師です。
月齢${moonAge}日（${phaseName}）の今日、
心が落ち着くような前向きなメッセージを100文字程度で伝えてください。
```

#### 5.2.3 観測アドバイス
```
あなたは天体観測のガイドです。
${date}の月（${phaseName}）を観測するための
ベストタイミングとヒントを100文字程度で教えてください。
```

---

## 6. PWA設定

### 6.1 next-pwa設定

#### 6.1.1 next.config.js
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js設定
});
```

#### 6.1.2 manifest.json
```json
{
  "name": "月の満ち欠け表示",
  "short_name": "月齢ビューア",
  "description": "今日の月の満ち欠けを確認できるアプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e293b",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 6.2 オフライン対応

#### 6.2.1 Service Worker戦略
- **月の計算**: Cache First（完全オフライン動作）
- **AI生成**: Network Only（オンライン必須）
- **静的アセット**: Cache First
- **画像**: Cache First

#### 6.2.2 オフライン時のUX
```typescript
// useAIGeneration.ts
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

// オフライン時はAI生成ボタンを無効化
```

---

## 7. 28番アプリとの連携

### 7.1 共通化対象

#### 7.1.1 スタイル
- Tailwind CSS設定ファイル共通化
- ダークモードテーマ統一
- カラーパレット統一

#### 7.1.2 コンポーネント
- `Navigation.tsx`：共通ナビゲーションバー
- Canvas描画のユーティリティ関数

#### 7.1.3 ファイル構成（共通部分）
```
shared/
├── components/
│   └── Navigation.tsx
├── styles/
│   └── theme.ts
└── utils/
    └── canvas.ts
```

### 7.2 連携方法
- **相互リンク**: ナビゲーションメニューに両アプリへのリンク
- **スタイル統一**: 同じテーマカラー・フォント使用
- **将来拡張**: 28番に月の位置表示機能を追加（Phase 2）

---

## 8. データモデル設計

### 8.1 型定義

```typescript
// types/moon.ts

export interface MoonPhaseData {
  date: Date;
  moonAge: number;        // 0-29.53
  phaseName: string;      // '新月', '上弦', '満月', '下弦'等
  illumination: number;   // 0-1 (0=新月, 1=満月)
}

export interface AIContent {
  trivia: string;         // 豆知識
  message: string;        // 運勢メッセージ
  observation: string;    // 観測アドバイス
  generatedAt: Date;
}

export interface MoonHistory {
  date: string;           // ISO 8601形式
  moonAge: number;
  phaseName: string;
  viewedAt: Date;
}

export interface AppSettings {
  apiKey?: string;
  favoritesDates: string[];
  history: MoonHistory[];
}
```

### 8.2 ローカルストレージ構造

```typescript
// localStorage keys
const STORAGE_KEYS = {
  API_KEY: 'moon-app-api-key',
  FAVORITES: 'moon-app-favorites',
  HISTORY: 'moon-app-history',
};

// 保存データ例
{
  "moon-app-api-key": "AIza...",
  "moon-app-favorites": ["2025-01-13", "2025-02-24"],
  "moon-app-history": [
    {
      "date": "2025-01-13",
      "moonAge": 14.2,
      "phaseName": "満月",
      "viewedAt": "2025-01-13T07:00:00Z"
    }
  ]
}
```

---

## 9. パフォーマンス最適化

### 9.1 Canvas最適化
- `requestAnimationFrame`でスムーズな60fps維持
- 描画範囲の最小化（差分描画）
- デバイスピクセル比対応（Retina対応）

### 9.2 AI生成最適化
- 生成中のローディング表示
- タイムアウト設定（30秒）
- エラー時のリトライ機構

### 9.3 レスポンシブ対応
```typescript
// 画面サイズに応じたCanvas調整
const getCanvasSize = () => {
  const width = window.innerWidth;
  if (width < 640) return width * 0.8;  // スマホ
  if (width < 1024) return width * 0.5; // タブレット
  return Math.min(width * 0.33, 500);   // デスクトップ
};
```

---

## 10. セキュリティ対策

### 10.1 APIキー管理
- クライアントサイドでの最小限の露出
- ユーザーが自身のAPIキーを設定
- localStorage保存時は暗号化検討（Phase 2）

### 10.2 入力バリデーション
- 日付範囲チェック（1925-2125）
- XSS対策（React自動エスケープ）
- AI生成コンテンツのサニタイズ

---

## 11. テスト戦略

### 11.1 単体テスト
- 月齢計算ロジック（Jest）
- Canvas描画関数（Jest + canvas-mock）
- AI APIクライアント（モックAPI使用）

### 11.2 統合テスト
- コンポーネント連携（React Testing Library）
- ローカルストレージ操作

### 11.3 E2Eテスト
- 日付選択 → 月の表示 → AI生成の流れ
- PWAインストール確認

---

## 12. デプロイ設計

### 12.1 推奨プラットフォーム
- **Vercel**（Next.js最適化）
- **Netlify**（代替）

### 12.2 APIキー設定
- **ローカルストレージ使用**: 環境変数は使用しない
- **設定方法**: アプリ内の「⚙️ 設定」ページから入力
- **保存先**: `localStorage.setItem('moon-app-api-key', 'your-key')`

### 12.3 ビルド設定
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 13. 将来拡張

### 13.1 Phase 2候補
- リアルタイム通知（満月アラート）
- SNS共有機能
- 天気API連携（観測可能性判定）
- 28番アプリへの月の位置表示機能追加

### 13.2 技術的負債の予防
- TypeScript strict mode有効化
- ESLint厳格設定
- コンポーネントの責務分離
- 適切なコメント記述

---

## 14. 次ステップ

1. ✅ 技術設計書レビュー・承認
2. ⬜ 実装計画書作成（TDD準拠版）
3. ⬜ 開発環境セットアップ
4. ⬜ 実装開始（Claude Code on the Web）

---

**作成者**: クロ
**レビュー待ち**: あおいさん
