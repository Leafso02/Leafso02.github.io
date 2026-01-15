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
export function applyBuffsToStats(baseStats, buffs) {

  /**
   * ============================
   * 1. ステータス構造を初期化
   * ============================
   */

  // 元の基礎ステ（JSONそのまま）
  const base = { ...baseStats };

  // 基礎ステータスを変更する効果（将来対応）
  const baseModifier = {};

  // %バフ（base参照）
  const percentBonus = {};

  // 実数加算バフ
  const flatBonus = {};

  /**
   * ============================
   * 2. バフを種類ごとに振り分ける
   * ============================
   */

  buffs.forEach(buff => {

    const stat = buff.valueType; // 例: "Atk", "CritDmg"

    // 未定義ステータスは無視
    if (!stat) return;

    switch (buff.valueUnit) {

      /**
       * ---------
       * %バフ
       * ---------
       * ・必ず base のみ参照
       */
      case "percent": {
        percentBonus[stat] = (percentBonus[stat] || 0) + buff.value;
        break;
      }

      /**
       * ---------
       * 実数加算
       * ---------
       */
      case "flat": {
        flatBonus[stat] = (flatBonus[stat] || 0) + buff.value;
        break;
      }

      /**
       * ---------
       * 基礎ステ変更（将来用）
       * ---------
       * 例: 基礎Atk +300 / ×1.2
       */
      case "baseAdd": {
        baseModifier[stat] ??= { add: 0, multiply: 1 };
        baseModifier[stat].add += buff.value;
        break;
      }

      case "baseMultiply": {
        baseModifier[stat] ??= { add: 0, multiply: 1 };
        baseModifier[stat].multiply *= buff.value;
        break;
      }

      default:
        // 未対応の valueUnit は無視（後で拡張）
        break;
    }
  });

  /**
   * ============================
   * 3. 有効基礎ステータスを確定
   * ============================
   */

  const effectiveBase = {};

  Object.keys(base).forEach(stat => {

    const modifier = baseModifier[stat];

    // 基礎ステ変更がない場合
    if (!modifier) {
      effectiveBase[stat] = base[stat];
      return;
    }

    // 基礎ステ変更がある場合
    effectiveBase[stat] =
      (base[stat] + modifier.add) * modifier.multiply;
  });

  /**
   * ============================
   * 4. 最終ステータスを算出
   * ============================
   *
   * final =
   *   effectiveBase
   * + (effectiveBase × percent)
   * + flat
   */

  const finalStats = {};

  Object.keys(effectiveBase).forEach(stat => {

    const baseValue = effectiveBase[stat];
    const percent = percentBonus[stat] || 0;
    const flat = flatBonus[stat] || 0;

    finalStats[stat] =
      baseValue +
      (baseValue * percent) +
      flat;
  });

  return finalStats;
}
