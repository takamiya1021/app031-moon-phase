# 実装計画書 - Moon Phase Viewer

## プロジェクト概要
月の満ち欠けを表示し、AIで生成された月にまつわる情報を提供するWebアプリケーション。

## 実装フェーズ

### Phase 1: 基本機能実装 ✅ 完了
- [x] Next.js + TypeScript プロジェクトセットアップ
- [x] 月齢計算ロジック (`lib/moonPhase.ts`)
- [x] 基準日: 2000年1月6日 18:14 UTC
- [x] 対応期間: 1925年〜2125年（±100年）

### Phase 2: UI実装 ✅ 完了
- [x] メインページレイアウト (`app/page.tsx`)
- [x] 日付選択コンポーネント (`components/DateSelector.tsx`)
- [x] 月情報表示コンポーネント (`components/MoonInfo.tsx`)
- [x] 設定ページ (`app/settings/page.tsx`)

### Phase 3: Canvas描画実装 ✅ 完了
- [x] 2D Canvas月表示 (`components/MoonCanvas.tsx`)
- [x] 月のテクスチャ (`public/moon-texture.jpg`)
- [x] 球面シャドウマスキング (物理ベース)
- [x] 周縁減光 (Limb Darkening)
- [x] ぼかし調整可能なターミネーターライン
- [x] Canvasサイズ最適化 (実際の月サイズに合わせて調整)

### Phase 4: AI機能実装 ✅ 完了
- [x] Google Generative AI SDK統合 (`lib/aiService.ts`)
  - モデル: `gemini-2.5-flash`
  - 動的インポートでバンドルサイズ最適化
- [x] ローカルストレージAPIキー管理 (`lib/storage.ts`)
  - 環境変数は使用しない
  - 設定ページから入力
- [x] AI生成コンテンツ:
  - 豆知識 (神話・文化・科学)
  - 運勢メッセージ (癒し・前向き)
  - 観測アドバイス (時間帯・ヒント)
- [x] ダミーデータフォールバック (APIキー未設定時)
- [x] APIキー未設定時の注意表示 (`components/GenerateButton.tsx`)

### Phase 5: データ管理 ✅ 完了
- [x] ローカルストレージ管理 (`lib/storage.ts`)
- [x] APIキー保存
- [x] 閲覧履歴 (最新10件)
- [x] お気に入り日付

### Phase 6: PWA実装 ✅ 完了
- [x] next-pwa 設定 (`next.config.js`)
- [x] マニフェスト (`public/manifest.json`)
- [x] Service Worker (`public/sw.js`)
- [x] オフライン対応
  - 月齢計算: オフラインOK
  - AI生成: オンライン必須

### Phase 7: E2Eテスト ✅ 完了
- [x] Playwright セットアップ (`playwright.config.ts`)
- [x] E2Eテスト実装 (`e2e/moon-phase.spec.ts`)
  - メインページ表示
  - 日付選択
  - 日付ナビゲーション
  - AI生成 (ダミーデータ)
- [x] `npm run test:e2e` スクリプト

### Phase 8: 視覚強化 ✅ 完了
- [x] 球面シャドウマスキング実装
- [x] 明るさ・コントラスト調整
  - 光源側: 1.5倍
  - 影側: 0.12倍
- [x] ターミネーターラインのシャープネス調整
  - 遷移ゾーン: 0.18
  - べき乗: 5.0
- [x] 色調補正 (青白い月)
  - R: 0.85, G: 0.95, B: 1.2
- [x] Canvas背景影の修正

## 技術スタック

### フレームワーク・ライブラリ
- Next.js 14.x (App Router)
- React 18.x
- TypeScript 5.x
- Tailwind CSS v3
- @google/generative-ai (Gemini SDK)
- next-pwa (PWA対応)

### テスト
- Jest (単体テスト)
- Playwright (E2Eテスト)

### デプロイ
- Vercel推奨 (Next.js最適化)

## 主要な設計決定

### 1. Canvas 2D vs Three.js
**決定**: Canvas 2Dを使用
**理由**:
- パフォーマンス (軽量)
- ピクセルレベルの制御が容易
- 3D不要 (正面から見た月のみ)

### 2. APIキー管理
**決定**: ローカルストレージのみ使用
**理由**:
- .env は絶対使用しない (ユーザー要件)
- 設定画面から入力
- ブラウザ依存でOK

### 3. AIモデル
**決定**: gemini-2.5-flash
**理由**:
- 最新モデル
- コストパフォーマンス
- 十分な品質

### 4. SDK vs Fetch
**決定**: Google Generative AI SDK使用
**理由**:
- タイプセーフ
- コード簡潔化 (80行 → 50行)
- 公式サポート

## 検証方法

### 自動テスト
```bash
npm run test         # Jest単体テスト
npm run test:e2e     # Playwright E2Eテスト
npm run build        # ビルド検証
```

### 手動検証
- [ ] 各月相の表示確認 (新月、上弦、満月、下弦)
- [ ] 日付変更の動作確認
- [ ] AI生成機能の確認 (APIキーあり/なし)
- [ ] PWAインストール確認
- [ ] オフライン動作確認

## ビルド・デプロイ

### ローカル開発
```bash
npm run dev          # 開発サーバー (port 3000)
```

### 本番ビルド
```bash
npm run build        # プロダクションビルド
npm run start        # 本番サーバー起動
```

### デプロイ
- Vercelへpush自動デプロイ推奨
- 環境変数不要 (APIキーはユーザーが設定画面で入力)

## 今後の拡張 (スコープ外)

- [ ] リアルタイム通知 (満月アラート)
- [ ] SNS共有機能
- [ ] 天気API連携
- [ ] より高解像度な月テクスチャ
