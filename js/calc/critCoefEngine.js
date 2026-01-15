/**
 * CritCoefEngine.js
 *
 * ・会心係数のみを算出する
 * ・ダメージ計算は行わない
 *
 * 会心係数 =
 *   1 + (会心率 × 会心ダメージ)
 */

/**
 * 会心係数を計算する
 *
 * @param {Object} params
 * @param {Object} params.finalStats
 *   statEngine.js で算出された最終ステータス
 *
 * @param {boolean} [params.isCritEnabled=true]
 *   会心計算を有効にするか（将来用）
 *
 * @returns {Object}
 *   {
 *     critCoef: number,
 *     critRate: number,
 *     critDmg: number,
 *     isCritEnabled: boolean
 *   }
 */
export function calculateCritCoef({
  finalStats,
  isCritEnabled = true
}) {

  const critRate = finalStats.CritRate ?? 0;
  const critDmg = finalStats.CritDmg ?? 0;

  // 会心OFF時（将来用）
  if (!isCritEnabled) {
    return {
      critCoef: 1,
      critRate,
      critDmg,
      isCritEnabled
    };
  }

  const critCoef = 1 + (critRate * critDmg);

  return {
    critCoef,
    critRate,
    critDmg,
    isCritEnabled
  };
}
