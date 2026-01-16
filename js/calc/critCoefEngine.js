/**
 * critCoefEngine.js
 *
 * ・会心係数のみを算出する
 * ・会心ON/OFFや確定会心は将来ここで吸収する
 */

export function calculateCritCoef(finalStats) {

  const critRate = clamp(finalStats.CritRate ?? 0, 0, 1);
  const critDmg  = Math.max(finalStats.CritDmg ?? 0, 0);

  // 会心係数
  // 会心係数 = 1 + 会心率 × 会心ダメージ
  const critCoef = 1 + critRate * critDmg;

  return {
    critCoef,
    used: {
      critRate,
      critDmg
    }
  };
}

/**
 * 値を範囲内に収める
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

