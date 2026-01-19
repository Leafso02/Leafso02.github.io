/**
 * statEngine.js
 *
 * ・基礎ステータスと各種バフを統合し
 * ・計算で使用する「最終参照ステータス」を生成する
 *
 * ⚠ このファイルは「ダメージ計算」を行わない
 * ⚠ %バフは必ず baseStat のみを参照する
 */

/**
 * バフを適用して最終ステータスを生成する
 *
 * @param {Object} baseStats
 *   キャラクターの基礎ステータス
 *   例: { Atk: 1000, CritRate: 0.05 }
 *
 * @param {Array} buffs
 *   collectBuffs から渡されるバフ配列
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

    const flat = buff.flat ?? 0;
    const percent = buff.percent ?? 0;

    finalStats[stat] =
      baseStats[stat] +
      flat +
      baseStats[stat] * percent;
  });

  return finalStats;
}