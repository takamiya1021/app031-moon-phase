# 🌙 月の満ち欠け表示（Moon Phase Viewer）

月の満ち欠けを美しく表示し、AI情報を生成するWebアプリケーション

## ✨ 特徴

- 📅 **日付選択**: 1925年〜2125年の200年間に対応
- 🌙 **月の満ち欠け表示**: Canvas描画でリアルタイムにアニメーション
- 🤖 **AI情報生成**: Google AI Studioで豆知識・運勢・観測アドバイスを生成
- 💾 **ローカルストレージ**: APIキー、閲覧履歴を自動保存
- 🎨 **ダークモード**: 夜空をイメージした美しいUI
- 📱 **レスポンシブ**: スマートフォン・タブレット対応
- 🔧 **PWA対応**: オフラインでも月の計算が可能

## 🚀 使い方

### 開発環境

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### テスト実行

```bash
# 全テスト実行
npm test

# テストをwatchモードで実行
npm run test:watch
```

### ビルド

```bash
# 本番環境用ビルド
npm run build

# 本番サーバー起動
npm start
```

## 🔑 API キー設定（オプション）

AI情報生成機能を使用するには、Google AI Studio APIキーが必要です。

1. [Google AI Studio](https://makersuite.google.com/app/apikey) でAPIキーを取得
2. アプリ内の「⚙️ 設定」から APIキーを設定

**注意**: APIキーがない場合でも、ダミーデータが表示されるため、アプリは動作します。

## 📦 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v3
- **テスト**: Jest + React Testing Library
- **AI API**: Google AI Studio (Gemini API)

## 🌙 機能詳細

### 月齢計算

- 基準日: 2000年1月6日 18:14 UTC（既知の新月）
- 平均朔望月: 29.53058867日
- 対応範囲: 1925年〜2125年（±100年）

### 月の名称

- 新月、三日月、上弦、十三夜、満月、寝待月、下弦、有明月、新月（前日）

### Canvas描画

- 背景: ダークグラデーション
- 星空: ランダム配置の明るい星（25個）
- 月: 満ち欠けの状態に応じた描画、クレーター模様付き
- アニメーション: 0.5秒のスムーズな遷移（ease-in-out）

## 📊 テスト

- **総テスト数**: 71個
- **テストスイート**: 9個
- **カバレッジ**: 月齢計算、Canvas描画、UIコンポーネント

テスト内訳:
- 月齢計算: 21テスト
- Canvas描画: 10テスト
- コンポーネント: 21テスト
- AI サービス: 8テスト
- その他: 11テスト

## 📁 プロジェクト構造

```
app031-moon-phase/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ
│   ├── layout.tsx         # ルートレイアウト
│   └── settings/          # 設定ページ
├── components/             # Reactコンポーネント
│   ├── MoonCanvas.tsx     # 月の描画
│   ├── DateSelector.tsx   # 日付選択
│   ├── MoonInfo.tsx       # 月の情報表示
│   ├── GenerateButton.tsx # AI生成ボタン
│   └── AIContentSection.tsx # AI生成コンテンツ表示
├── lib/                    # ユーティリティ
│   ├── moonPhase.ts       # 月齢計算
│   ├── moonDraw.ts        # Canvas描画
│   ├── aiService.ts       # AI API統合
│   └── storage.ts         # ローカルストレージ
├── hooks/                  # カスタムフック
│   ├── useMoonPhase.ts    # 月の満ち欠け管理
│   └── useAIGeneration.ts # AI生成管理
├── types/                  # 型定義
│   └── moon.ts            # 月関連の型
└── __tests__/             # テストファイル

```

## 🎯 開発の流れ（TDD準拠）

このプロジェクトは、Test-Driven Development（TDD）の原則に従って開発されました。

1. **Phase 0**: テスト環境構築
2. **Phase 1**: 月齢計算ロジック実装
3. **Phase 2**: Canvas描画実装
4. **Phase 3**: 日付選択UI実装
5. **Phase 4**: AI生成機能実装
6. **Phase 5**: ローカルストレージ実装
7. **Phase 6**: PWA対応
8. **Phase 7**: 28番アプリ連携（予定）
9. **Phase 8**: 統合テスト・最終調整

各フェーズで **Red-Green-Refactor** サイクルを適用しています。

## 📄 ライセンス

MIT License

## 👤 作成者

Claude Code Project - Moon Phase App 031

---

**月齢計算範囲**: 1925年〜2125年
**バージョン**: 1.0.0
**最終更新**: 2025年1月
