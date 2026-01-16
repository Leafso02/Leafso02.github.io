/**
 * baseDamageEngine.js
 *
 * ・「ダメージ基礎値」のみを算出する
 * ・最終ダメージ計算は行わない
 *
 * ダメージ基礎値 =
 *   参照ステータス × 軌跡倍率 + ダメージ加算
 */

/**
 * ダメージ基礎値を計算する
 *
 * @param {Object} params
 * @param {Object} params.skillData
 *   キャラクターの skill.json
 *
 * @param {Object} params.multiplierData
 *   multiplier.json
 *
 * @param {Object} params.finalStats
 *   statEngine.js で算出された最終ステータス
 *
 * @param {string} params.skillKey
 *   使用スキルのキー
 *   例: "basicATK", "ultimate"
 *
 * @param {number} params.skillLevel
 *   使用スキルのレベル
 *
 * @returns {Object}
 *   {
 *     baseDamage: number,
 *     refStat: string,
 *     traceMultiplier: number,
 *     increaseDamage: number
 *   }
 */
export function calculateBaseDamage({
  skillData,
  multiplierData,
  finalStats,
  skillKey,
  skillLevel
}) {

  /**
   * ============================
   * 1. 使用スキル定義を取得
   * ============================
   */

  const skillCategory = skillData[skillKey];

  if (!skillCategory || !skillCategory.base?.length) {
    throw new Error(`スキル定義が見つかりません: ${skillKey}`);
  }

  // 今回は「攻撃スキルは1つだけ」という前提
  const skill = skillCategory.base[0];

  /**
   * ============================
   * 2. 参照ステータスを取得
   * ============================
   */

  // atk 定義の最初の要素を参照
  const atkDef = skill.atk?.[0];

  if (!atkDef) {
    throw new Error(`攻撃定義が存在しません: ${skillKey}`);
  }

  const refStatKey = atkDef.reference; // 例: "Atk"

  const refStatValue = finalStats[refStatKey];

  if (refStatValue == null) {
    throw new Error(`参照ステータスが見つかりません: ${refStatKey}`);
  }

  /**
   * ============================
   * 3. 軌跡倍率を取得
   * ============================
   */

  const multiplierTableName = atkDef.multiplier; // 例: "basicATK"

  const multiplierTable = multiplierData[multiplierTableName];
  console.log("multiplierTable " + multiplierTable)

  if (!multiplierTable) {
    throw new Error(`倍率テーブルが存在しません: ${multiplierTableName}`);
  }

  const traceMultiplier = multiplierTable[skillLevel];

  if (traceMultiplier == null) {
    throw new Error(
      `倍率が見つかりません: ${multiplierTableName} Lv.${skillLevel}`
    );
  }

  /**
   * ============================
   * 4. ダメージ加算（入れ物）
   * ============================
   */

  // 今回はまだ計算しない
  const increaseDamage = 0;

  /**
   * ============================
   * 5. ダメージ基礎値を計算
   * ============================
   */

  const baseDamage =
    (refStatValue * traceMultiplier) +
    increaseDamage;

  return {
    baseDamage,
    refStat: refStatKey,
    traceMultiplier,
    increaseDamage
  };
}
