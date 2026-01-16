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

  // 2. ステータスごとに集計用バケツを用意
  const flatBonus = {};
  const percentBonus = {};

  Object.keys(baseStats).forEach(stat => {
    flatBonus[stat] = 0;
    percentBonus[stat] = 0;
  });

  // 3. バフを振り分け
  buffs.forEach(buff => {
    const stat = buff.valueType;
    if (!(stat in baseStats)) return;

    if (buff.valueUnit === "flat") {
      flatBonus[stat] += buff.value;
    }

    if (buff.valueUnit === "percent") {
      percentBonus[stat] += buff.value;
    }
  });

  // 4. 計算
  Object.keys(baseStats).forEach(stat => {
    finalStats[stat] =
      baseStats[stat] +
      flatBonus[stat] +
      baseStats[stat] * percentBonus[stat];
  });

  return finalStats;
}