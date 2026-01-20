/**
 * statEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : なし
 * ================================
 * ・基礎ステータスと各種バフを統合し
 * ・計算で使用する「最終参照ステータス」を生成する
 *
 * ⚠ %バフは必ず baseStat のみを参照する
 */

import { checkStatsCondition } from "./conditionCheck.js";

/**
 * バフを適用して最終ステータスを生成する
 *
 * @param {Object} baseStats
 *   キャラクターの基礎ステータス
 *   例: { Atk: 1000, CritRate: 0.05 }
 *
 * @param {Array} buffs
 *   collectBuffs から渡されるバフオブジェクト
 *
 * @returns {Object}
 *   計算に使用する最終ステータス
 */
export function calculateFinalStats(baseStats, buffs) {

  // 将来の基礎ステータス変更バフ用
  // baseStats = modifyBaseStats(baseStats, buffs);
  
   // 1. 初期化
  const finalStats = { ...baseStats };

  Object.keys(baseStats).forEach(stat => {
    const buff = buffs[stat];

    if (!buff) {
      finalStats[stat] = baseStats[stat];
      return;
    }

    const flatValue = buff.flatValue ?? 0;
    const value = buff.value ?? 0;

    if (stat === "CritRate" || stat === "CritDmg") {
      finalStats[stat] =
        baseStats[stat] + value;
      return;
    }


    finalStats[stat] =
      baseStats[stat] +
      flatValue +
      baseStats[stat] * value;
  });

  console.log(finalStats);
  return finalStats;
}