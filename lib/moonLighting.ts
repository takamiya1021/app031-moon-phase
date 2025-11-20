/**
 * 月のライティング関連のユーティリティ
 * - 満ち欠けに合わせて太陽方向ベクトルを算出する
 */

export const SYNODIC_MONTH = 29.53058867; // 日

export type Vector3Tuple = [number, number, number];

/**
 * 月齢を1周（0〜29.53）に正規化する
 */
export function normalizeMoonAge(moonAge: number): number {
  if (!Number.isFinite(moonAge)) return 0;
  const wrapped = moonAge % SYNODIC_MONTH;
  return wrapped < 0 ? wrapped + SYNODIC_MONTH : wrapped;
}

/**
 * 月齢から太陽方向（単位ベクトル）を計算する
 * - new moon (0日) で z = -1（観測者から見て背面からの照射）
 * - full moon (~14.77日) で z = +1（観測者背面からの照射）
 * - quarter で x 軸方向に向く（右=上弦、左=下弦）
 */
export function computeSunDirection(moonAge: number): Vector3Tuple {
  const normalizedAge = normalizeMoonAge(moonAge);
  const phase = (normalizedAge / SYNODIC_MONTH) * Math.PI * 2;

  const x = Math.sin(phase);
  const y = 0;
  const z = -Math.cos(phase);

  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

/**
 * 任意距離での太陽位置（directional light用）を取得する
 */
export function computeSunPosition(moonAge: number, distance = 5): Vector3Tuple {
  const direction = computeSunDirection(moonAge);
  return direction.map(component => component * distance) as Vector3Tuple;
}
