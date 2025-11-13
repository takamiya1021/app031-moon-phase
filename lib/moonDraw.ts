/**
 * Canvas描画ユーティリティ - Phase 2-2 (Green)
 * 月と背景を描画する関数群
 */

/**
 * 背景にダークグラデーションを描画
 * @param ctx - Canvas 2Dコンテキスト
 * @param width - キャンバスの幅
 * @param height - キャンバスの高さ
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // 上から下へのグラデーション（深い青〜黒）
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1e3a8a'); // 深い青
  gradient.addColorStop(0.5, '#1e293b'); // スレートグレー
  gradient.addColorStop(1, '#0f172a'); // 濃い黒

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 背景に明るい星を描画
 * @param ctx - Canvas 2Dコンテキスト
 * @param width - キャンバスの幅
 * @param height - キャンバスの高さ
 * @param count - 星の数
 */
export function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
): void {
  ctx.save();

  for (let i = 0; i < count; i++) {
    // ランダムな位置
    const x = Math.random() * width;
    const y = Math.random() * height;

    // ランダムなサイズ（肉眼で見える明るさを模擬）
    const radius = Math.random() * 1.5 + 0.5; // 0.5〜2px

    // ランダムな明るさ
    const opacity = Math.random() * 0.5 + 0.5; // 0.5〜1.0

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 月の満ち欠けを描画
 * @param ctx - Canvas 2Dコンテキスト
 * @param x - 月の中心X座標
 * @param y - 月の中心Y座標
 * @param radius - 月の半径
 * @param illumination - 照度（0=新月, 1=満月）
 */
export function drawMoon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  illumination: number
): void {
  ctx.save();

  // 月の基本色（やや温かみのある白）
  const moonColor = '#f0e6d2';
  const shadowColor = '#1a1a2e';

  // 月全体を描画（影の部分含む）
  ctx.fillStyle = shadowColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  // グローエフェクト（月の周りの光）
  if (illumination > 0) {
    const gradient = ctx.createRadialGradient(x, y, radius * 0.9, x, y, radius * 1.3);
    gradient.addColorStop(0, 'rgba(255, 245, 220, 0)');
    gradient.addColorStop(1, `rgba(255, 245, 220, ${illumination * 0.3})`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.3, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 月の明るい部分を描画
  ctx.fillStyle = moonColor;
  ctx.beginPath();

  if (illumination === 0) {
    // 新月: 何も描画しない（影のみ）
  } else if (illumination === 1) {
    // 満月: 完全な円
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    // 三日月〜満月の間: クリッピングで描画
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.clip();

    // 照度に応じた楕円を描画
    // illumination < 0.5: 三日月〜上弦（右半分が明るい）
    // illumination > 0.5: 上弦〜満月（ほぼ全体が明るい）
    const phase = (illumination - 0.5) * 2; // -1 to 1

    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      radius * Math.abs(phase),
      radius,
      0,
      0,
      2 * Math.PI
    );

    if (illumination < 0.5) {
      // 三日月〜上弦: 右半分を描画
      ctx.rect(x, y - radius, radius, radius * 2);
    } else {
      // 上弦〜満月: 左側も描画
      ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    }

    ctx.fill('evenodd');
  }

  ctx.restore();

  // 月のテクスチャ（クレーター風）を追加
  if (illumination > 0.1) {
    drawMoonCraters(ctx, x, y, radius, illumination);
  }
}

/**
 * 月のクレーター（模様）を描画
 * @param ctx - Canvas 2Dコンテキスト
 * @param x - 月の中心X座標
 * @param y - 月の中心Y座標
 * @param radius - 月の半径
 * @param illumination - 照度
 */
function drawMoonCraters(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  illumination: number
): void {
  ctx.save();

  // 月の領域でクリッピング
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.clip();

  // ランダムシードを固定（同じ位置に描画するため）
  const craters = [
    { x: 0.3, y: -0.2, r: 0.15 },
    { x: -0.2, y: 0.3, r: 0.1 },
    { x: 0.1, y: 0.4, r: 0.08 },
    { x: -0.3, y: -0.3, r: 0.12 },
    { x: 0.4, y: 0.1, r: 0.07 },
  ];

  craters.forEach(crater => {
    const craterX = x + crater.x * radius;
    const craterY = y + crater.y * radius;
    const craterR = crater.r * radius;

    ctx.fillStyle = `rgba(26, 26, 46, ${0.2 * illumination})`;
    ctx.beginPath();
    ctx.arc(craterX, craterY, craterR, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.restore();
}
