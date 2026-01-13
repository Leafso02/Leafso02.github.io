import { getMultiplier } from "./multiplierEngine.js";

/**
 * ダメージ計算の最終段階
 *
 * @param {Object} attackerStats - 攻撃者の最終ステータス
 * @param {Object} multiplierData - 倍率テーブル
 * @param {string} skillType - 攻撃方法
 * @param {number} skillLevel - スキルレベル
 */
export function calculateDamage({
  attackerStats,
  multiplierData,
  skillType,
  skillLevel
}) {
  const atk = attackerStats.atk;

  // 基本倍率取得
  const multiplier = getMultiplier(
    multiplierData,
    skillType,
    skillLevel,
    "x"
  );

  // 攻撃力 × 倍率
  let damage = atk * multiplier;

  // 会心ダメージ補正
  if (attackerStats.critDmg) {
    damage *= 1 + attackerStats.critDmg;
  }

  return Math.floor(damage);
}
