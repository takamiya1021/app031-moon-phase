# 📝 実装計画書（TDD準拠版）：No.31「月の満ち欠け表示」

**作成日**: 2025-01-13
**バージョン**: 1.0
**アプリ番号**: 31

---

## 実装方針

### TDD（Test-Driven Development）原則
- 全Phaseで **Red-Green-Refactor** サイクルを適用
- テストファースト：実装前にテストを書く
- 完了条件：全テストパス、コードカバレッジ80%以上

### 開発環境
- Next.js 14.x + TypeScript 5.x
- テストフレームワーク: Jest + React Testing Library
- E2Eテスト: Playwright（オプション）

---

## Phase 0: テスト環境構築（予定工数: 2時間）

### タスク

- [ ] **0-1. Next.jsプロジェクトセットアップ（Red）**
  - `npx create-next-app@latest app031-moon-phase --typescript --tailwind --app`
  - プロジェクト構造確認
  - **完了条件**: `npm run dev`で起動確認

- [ ] **0-2. Jest + React Testing Library設定（Green）**
  - `npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`
  - `jest.config.js`作成
  - `setupTests.ts`作成
  - **完了条件**: `npm test`でテスト実行可能

- [ ] **0-3. Canvas Mock設定（Green）**
  - `npm install --save-dev jest-canvas-mock`
  - Canvas API用のモック設定
  - **完了条件**: Canvas描画テストが実行可能

- [ ] **0-4. サンプルテスト作成・実行（Refactor）**
  - `__tests__/sample.test.ts`作成
  - テスト実行確認
  - **完了条件**: テストがパスすることを確認

---

## Phase 1: 月齢計算ロジック実装（予定工数: 3時間）

### タスク

- [ ] **1-1. 月齢計算テスト作成（Red）**
  - `__tests__/lib/moonPhase.test.ts`作成
  - 既知の日付での月齢計算テストケース
  - エッジケース（1925年、2125年）テスト
  - **完了条件**: テストが失敗することを確認

- [ ] **1-2. 月齢計算ロジック実装（Green）**
  - `lib/moonPhase.ts`作成
  - `calculateMoonAge()`関数実装
  - `getMoonPhaseName()`関数実装
  - `getMoonIllumination()`関数実装
  - **完了条件**: 全テストがパス

- [ ] **1-3. 型定義整備（Refactor）**
  - `types/moon.ts`作成
  - `MoonPhaseData`インターフェース定義
  - 関数の戻り値を型安全に
  - **完了条件**: TypeScriptエラーゼロ、テストパス

- [ ] **1-4. カスタムフック作成（Red → Green → Refactor）**
  - `__tests__/hooks/useMoonPhase.test.ts`作成（Red）
  - `hooks/useMoonPhase.ts`実装（Green）
  - React Hooksのルール準拠確認（Refactor）
  - **完了条件**: 全テストパス、Hooks動作確認

---

## Phase 2: Canvas描画実装（予定工数: 5時間）

### タスク

- [ ] **2-1. Canvas描画ユーティリティテスト作成（Red）**
  - `__tests__/lib/moonDraw.test.ts`作成
  - `drawMoon()`関数のテストケース
  - `drawStars()`関数のテストケース
  - **完了条件**: テストが失敗することを確認

- [ ] **2-2. Canvas描画ロジック実装（Green）**
  - `lib/moonDraw.ts`作成
  - `drawMoon()`関数実装（月の満ち欠け描画）
  - `drawStars()`関数実装（背景の明るい星）
  - `drawBackground()`関数実装（ダークグラデーション）
  - **完了条件**: 全テストがパス

- [ ] **2-3. MoonCanvasコンポーネントテスト作成（Red）**
  - `__tests__/components/MoonCanvas.test.tsx`作成
  - コンポーネント描画テスト
  - プロパティ変更時の再描画テスト
  - **完了条件**: テストが失敗することを確認

- [ ] **2-4. MoonCanvasコンポーネント実装（Green）**
  - `components/MoonCanvas.tsx`作成
  - `useEffect`でCanvas初期化
  - `useMoonPhase`統合
  - **完了条件**: 全テストがパス、実際の描画確認

- [ ] **2-5. アニメーション実装（Refactor）**
  - `requestAnimationFrame`でスムーズ遷移
  - イージング関数適用
  - パフォーマンス最適化
  - **完了条件**: 60fps維持、テストパス

---

## Phase 3: 日付選択UI実装（予定工数: 4時間）

### タスク

- [ ] **3-1. DateSelectorテスト作成（Red）**
  - `__tests__/components/DateSelector.test.tsx`作成
  - カレンダー表示テスト
  - 日付変更イベントテスト
  - 前後矢印ボタンテスト
  - **完了条件**: テストが失敗することを確認

- [ ] **3-2. DateSelectorコンポーネント実装（Green）**
  - `components/DateSelector.tsx`作成
  - 月単位カレンダーUI
  - 前後矢印（1日ずつ移動）
  - 日付範囲チェック（1925-2125）
  - **完了条件**: 全テストがパス

- [ ] **3-3. MoonInfoコンポーネント実装（Red → Green → Refactor）**
  - `__tests__/components/MoonInfo.test.tsx`作成（Red）
  - `components/MoonInfo.tsx`実装（Green）
  - 月齢・名称表示のフォーマット調整（Refactor）
  - **完了条件**: 全テストパス、表示確認

- [ ] **3-4. メインページ統合（Refactor）**
  - `app/page.tsx`に各コンポーネント統合
  - レイアウト調整
  - レスポンシブ対応確認
  - **完了条件**: 全コンポーネント連携動作、テストパス

---

## Phase 4: AI生成機能実装（予定工数: 5時間）

### タスク

- [ ] **4-1. AIサービステスト作成（Red）**
  - `__tests__/lib/aiService.test.ts`作成
  - モックAPIレスポンス定義
  - `generateMoonContent()`関数テスト
  - エラーハンドリングテスト
  - **完了条件**: テストが失敗することを確認

- [ ] **4-2. AIサービス実装（Green）**
  - `lib/aiService.ts`作成
  - Google AI Studio API統合
  - プロンプト生成ロジック
  - レスポンスパース処理
  - **完了条件**: 全テストがパス、実API動作確認

- [ ] **4-3. useAIGenerationフック実装（Red → Green → Refactor）**
  - `__tests__/hooks/useAIGeneration.test.ts`作成（Red）
  - `hooks/useAIGeneration.ts`実装（Green）
  - ローディング状態管理（Refactor）
  - オンライン/オフライン判定（Refactor）
  - **完了条件**: 全テストパス、Hooks動作確認

- [ ] **4-4. AIContentSectionコンポーネント実装（Red → Green → Refactor）**
  - `__tests__/components/AIContentSection.test.tsx`作成（Red）
  - `components/AIContentSection.tsx`実装（Green）
  - 豆知識・運勢・観測アドバイス表示（Green）
  - ローディング・エラー表示（Refactor）
  - **完了条件**: 全テストパス、表示確認

- [ ] **4-5. GenerateButtonコンポーネント実装（Red → Green → Refactor）**
  - `__tests__/components/GenerateButton.test.tsx`作成（Red）
  - `components/GenerateButton.tsx`実装（Green）
  - オフライン時の無効化（Refactor）
  - **完了条件**: 全テストパス、動作確認

---

## Phase 5: ローカルストレージ実装（予定工数: 3時間）

### タスク

- [ ] **5-1. ストレージユーティリティテスト作成（Red）**
  - `__tests__/lib/storage.test.ts`作成
  - `saveApiKey()`関数テスト
  - `loadHistory()`関数テスト
  - `saveFavorites()`関数テスト
  - **完了条件**: テストが失敗することを確認

- [ ] **5-2. ストレージユーティリティ実装（Green）**
  - `lib/storage.ts`作成
  - localStorage操作関数実装
  - JSON シリアライズ/デシリアライズ
  - エラーハンドリング
  - **完了条件**: 全テストがパス

- [ ] **5-3. 設定画面実装（Red → Green → Refactor）**
  - `__tests__/app/settings/page.test.tsx`作成（Red）
  - `app/settings/page.tsx`実装（Green）
  - APIキー入力フォーム（Green）
  - データクリア機能（Refactor）
  - **完了条件**: 全テストパス、動作確認

- [ ] **5-4. 履歴・お気に入り機能統合（Refactor）**
  - メインページに履歴表示追加
  - お気に入り登録ボタン追加
  - **完了条件**: 全機能動作、テストパス

---

## Phase 6: PWA対応（予定工数: 3時間）

### タスク

- [ ] **6-1. next-pwa設定（Red）**
  - `npm install next-pwa`
  - `next.config.js`設定
  - `public/manifest.json`作成
  - **完了条件**: ビルド成功、警告ゼロ

- [ ] **6-2. Service Worker動作確認（Green）**
  - PWAインストール確認
  - オフライン動作テスト
  - キャッシュ戦略確認
  - **完了条件**: オフラインで月の計算が動作

- [ ] **6-3. アイコン作成（Green）**
  - `public/icon-192.png`作成
  - `public/icon-512.png`作成
  - ファビコン設定
  - **完了条件**: アイコン表示確認

- [ ] **6-4. PWAメタデータ設定（Refactor）**
  - `app/layout.tsx`にメタデータ追加
  - theme-color設定
  - apple-touch-icon設定
  - **完了条件**: PWA Lighthouse スコア90以上

---

## Phase 7: 28番アプリ連携（予定工数: 2時間）

### タスク

- [ ] **7-1. 共通ナビゲーション実装（Red → Green → Refactor）**
  - `__tests__/components/Navigation.test.tsx`作成（Red）
  - `components/Navigation.tsx`実装（Green）
  - 両アプリへのリンク設定（Green）
  - スタイル統一（Refactor）
  - **完了条件**: 全テストパス、ナビゲーション動作

- [ ] **7-2. 共通スタイル整理（Refactor）**
  - `tailwind.config.js`の共通化検討
  - テーマカラー統一
  - **完了条件**: 両アプリのデザイン一貫性確認

- [ ] **7-3. 28番アプリへの相互リンク追加（調整）**
  - 28番アプリに本アプリへのリンク追加
  - （可能であれば）月の描画機能追加検討
  - **完了条件**: 相互遷移動作確認

---

## Phase 8: 統合テスト・最終調整（予定工数: 4時間）

### タスク

- [ ] **8-1. E2Eテスト作成（Red）**
  - Playwright設定
  - `e2e/moon-phase.spec.ts`作成
  - ユーザーフロー全体のテスト
  - **完了条件**: テストが失敗することを確認

- [ ] **8-2. E2Eテスト実装（Green）**
  - 日付選択 → 月の表示 → AI生成の流れ
  - PWAインストールテスト
  - オフライン動作テスト
  - **完了条件**: 全E2Eテストがパス

- [ ] **8-3. E2Eテストのリファクタリング（Refactor）**
  - テストコードの重複排除
  - ヘルパー関数の抽出
  - Page Objectパターン適用
  - テストの可読性・メンテナンス性向上
  - **完了条件**: E2Eテストコードが整理され、保守しやすい状態

- [ ] **8-4. パフォーマンス最適化（Refactor）**
  - Lighthouse監査実行
  - パフォーマンススコア改善
  - アクセシビリティ改善
  - **完了条件**: Lighthouse スコア90以上（全カテゴリ）

- [ ] **8-5. コードレビュー・リファクタリング（Refactor）**
  - ESLint警告ゼロ
  - TypeScript strict mode有効化
  - コードコメント追加
  - **完了条件**: 静的解析エラーゼロ

- [ ] **8-6. ドキュメント整備（完了）**
  - README.md作成
  - 開発ガイド記載
  - デプロイ手順記載
  - **完了条件**: ドキュメント完備

---

## マイルストーン

| マイルストーン | 期限目安 | 完了条件 |
|---------------|---------|---------|
| M1: テスト環境構築完了 | Day 1 | Phase 0完了、全テスト実行可能 |
| M2: コア機能実装完了 | Day 3 | Phase 1-3完了、月の表示・日付選択動作 |
| M3: AI機能実装完了 | Day 5 | Phase 4完了、AI生成動作 |
| M4: データ永続化完了 | Day 6 | Phase 5完了、設定保存動作 |
| M5: PWA対応完了 | Day 7 | Phase 6完了、オフライン動作 |
| M6: 連携・統合完了 | Day 8 | Phase 7-8完了、全機能動作 |

---

## 完了基準

### 機能要件
- ✅ 日付選択（±100年対応）
- ✅ 月の満ち欠け描画（Canvas、アニメーション）
- ✅ 月齢・名称表示
- ✅ AI生成コンテンツ（豆知識・運勢・観測アドバイス）
- ✅ ローカルストレージ（APIキー、履歴、お気に入り）
- ✅ PWA（オフライン対応、インストール可能）
- ✅ 28番アプリとの連携（ナビゲーション）

### 品質要件
- ✅ 全テストパス（単体・統合・E2E）
- ✅ コードカバレッジ80%以上
- ✅ Lighthouse スコア90以上（全カテゴリ）
- ✅ TypeScriptエラーゼロ
- ✅ ESLint警告ゼロ

### ドキュメント要件
- ✅ README.md完備
- ✅ コードコメント適切
- ✅ 開発ガイド記載

---

## リスク管理

| リスク | 発生確率 | 影響度 | 対策 |
|--------|---------|--------|------|
| Canvas描画パフォーマンス低下 | 中 | 高 | 早期プロトタイプで検証 |
| AI API利用制限超過 | 低 | 中 | ユーザー自身のAPIキー使用 |
| 天文計算の精度不足 | 低 | 中 | 既知の日付でテスト検証 |
| PWA設定の複雑さ | 中 | 中 | next-pwa公式ドキュメント参照 |
| 28番アプリとの統合コスト | 中 | 低 | Phase 1として最小限実装 |

---

## 次ステップ

1. ✅ 実装計画書レビュー・承認
2. ⬜ 開発環境セットアップ（Phase 0開始）
3. ⬜ Claude Code on the Webで実装開始

---

**作成者**: クロ
**レビュー待ち**: あおいさん
**総予定工数**: 約31時間（8日間想定）
