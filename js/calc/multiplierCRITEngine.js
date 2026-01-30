/**
 * multiplierCRITEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : なし
 * ================================
 * ・会心係数のみを算出する
 * ・会心ON/OFFや確定会心は将来ここで吸収する
 */

export function calculateCRITMultiplier(finalStats) {

  const critRate = clamp(finalStats.CRITRate, 0, 1);
  const critDmg  = finalStats.CRITDMG;

  // 会心係数
  // 会心係数 = 1 + 会心率 × 会心ダメージ
  const CRITMultiplier = 1 + critRate * critDmg;

  return {
    CRITMultiplier,
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

