# 実写風月の満ち欠け表示の課題

## 📋 プロジェクト概要
- **アプリ名**: app031 月の満ち欠け表示アプリ
- **目的**: 実写に近い月の画像を使って、正確な満ち欠けを表現する
- **現状**: Canvas描画での実装を試みたが、満ち欠けのマスク処理が期待通りに動作しない

## 🎯 求められる仕様
1. **実写風の月**: NASA提供の実際の月の写真を使用
2. **滑らかな満ち欠け**: 新月（0%）から満月（100%）まで滑らかに変化
3. **正確な形状**: 天文学的に正確な満ち欠けの形（三日月、上弦の月、満月など）
4. **美しい表現**: マスク処理のエッジが汚くない、自然な見た目

## 📁 現在のファイル構成
```
/home/ustar-wsl-2-2/projects/100apps/app031-moon-phase/
├── lib/moonDraw.ts              # 月の描画ロジック（問題のファイル）
├── components/MoonCanvas.tsx     # Canvasコンポーネント
├── public/moon-texture.jpg       # NASA提供の月の実写画像（136KB）
└── doc/
    ├── requirements.md           # 要件定義書
    ├── technical-design.md       # 技術設計書
    └── implementation-plan.md    # 実装計画書
```

## 🔄 これまでの試行錯誤

### 試行1: 基本的なマスク処理
**アプローチ**:
- Canvas APIの `clip()` と楕円描画で満ち欠けを表現
- 影の部分を `fillStyle` で塗りつぶす

**結果**:
❌ マスク処理が汚い
- エッジがギザギザ
- 境界線がハードすぎる

### 試行2: グラデーション影
**アプローチ**:
- `radialGradient` で影の境界をグラデーションに
- `globalCompositeOperation = 'source-atop'` で合成

**結果**:
❌ まだマスク処理が汚い
- グラデーションの範囲が適切でない
- 満ち欠けの形状が不自然

### 試行3: 天文学的計算に基づく実装
**アプローチ**:
- 明暗境界線（terminator）を正確に計算
- `Math.cos()` で球体の曲面を表現
- 楕円の横幅を照度に応じて計算

**コード例**:
```typescript
const terminatorX = radius * 2 * illumination;
const ellipseWidth = radius * Math.abs(Math.cos((illumination - 0.5) * Math.PI));
```

**結果**:
❌ 満ち欠けの見え方が期待と違う
- ユーザーから「月の満ち欠けって、こうじゃない」との指摘
- 形状が実際の月と異なる

## 🚨 主な課題

### 1. マスク処理の品質
- Canvas APIでの描画では、実写画像に対して滑らかなマスク処理が難しい
- `evenodd` fill や `clip()` の限界

### 2. 満ち欠けの形状
- 球体の3D形状を2Dで正確に表現するのが困難
- illumination（照度 0〜1）から正確な形状への変換が複雑

### 3. 技術的制約
- Canvas 2D APIの限界
- リアルタイム描画でのパフォーマンス
- アンチエイリアシングの制御が難しい

## 💡 考えられる代替案

### 案1: WebGLを使用
- シェーダーで3D球体として月を描画
- ライティング計算で正確な満ち欠けを表現
- 高品質なアンチエイリアシング

### 案2: 事前生成画像セット
- 満ち欠けの各段階（例：100段階）を事前に画像生成
- ランタイムでは画像の切り替えのみ
- 品質は高いが、ファイルサイズが大きい

### 案3: SVGマスク
- SVG `<mask>` 要素で満ち欠けを表現
- CSS/SVGアニメーションでスムーズな変化
- Canvas APIより滑らかな描画が可能

### 案4: Three.jsで3D球体
- 3Dライブラリで月を球体として描画
- 光源位置を変えて満ち欠けを表現
- 最も正確だが、ライブラリサイズが大きい

## 📊 現在の技術スタック
- **フレームワーク**: Next.js 14.2.18
- **言語**: TypeScript
- **描画**: Canvas 2D API
- **画像**: NASA LROC (Lunar Reconnaissance Orbiter Camera) の月面画像

## 🎯 チャッピーへの依頼内容

以下のいずれかの方法で、**実写風で正確な月の満ち欠け表示**を実現したい：

1. 現在のCanvas APIアプローチの改善案（可能であれば）
2. WebGL/Three.jsを使った3D実装の提案と設計
3. SVGマスクを使った代替実装の提案
4. その他、技術的に優れたアプローチの提案

### 必須要件
- ✅ 実写に近い見た目（NASA画像使用）
- ✅ 滑らかな満ち欠けのアニメーション
- ✅ 天文学的に正確な形状
- ✅ パフォーマンスが良い（リアルタイム描画）
- ✅ 現在のReact/Next.js環境に統合可能

### 優先度
1. **品質最優先**: マスク処理が美しく、満ち欠けが正確
2. **実装の簡潔さ**: 既存コードへの統合が容易
3. **パフォーマンス**: 60fps以上でスムーズに動作

## 📝 参考情報

### illumination（照度）の定義
```typescript
// lib/moonPhase.ts より
illumination: 0    // 新月（真っ暗）
illumination: 0.25 // 三日月（右側が細く光る）
illumination: 0.5  // 上弦の月（右半分が光る）
illumination: 0.75 // 満月近く（左端に細い影）
illumination: 1.0  // 満月（全体が光る）
```

### 現在の描画関数シグネチャ
```typescript
// lib/moonDraw.ts
export function drawMoon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  illumination: number,
  moonImage?: HTMLImageElement
): void
```

### コンポーネント統合
```typescript
// components/MoonCanvas.tsx
<MoonCanvas moonPhaseData={moonPhaseData} size={400} />
```

## 🔗 関連リソース
- **NASA画像ソース**: https://svs.gsfc.nasa.gov/4720/
- **画像パス**: `/public/moon-texture.jpg`
- **サーバー**: http://172.22.157.213:3031

---

**作成日**: 2025-11-13
**作成者**: クロ（Claude Code）
**依頼先**: チャッピー（Codex）
