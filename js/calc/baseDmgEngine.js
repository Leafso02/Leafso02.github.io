import { getMultiplierValue } from "./multiplierEngine.js";
/**
 * baseDamageEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : multiplierEngine.js
 * ================================
 * 
 * 「ダメージ基礎値」のみを算出する
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
  skillLevel,
  buffs
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


  const multiplierTableName = atkDef.multiplier; // 例: "ultimate"

  const traceMultiplier = getMultiplierValue(
    multiplierData,
    multiplierTableName,
    skillLevel,
    "x"
  );

  /**
   * ============================
   * 4. ダメージ加算
   * ============================
   */

  const addMultiplierDmg = buffs.AddMultiplierDmg.value;
  

  /**
   * ============================
   * 5. ダメージ基礎値を計算
   * ============================
   */

  const baseDamage =
    (refStatValue * traceMultiplier) +
    addMultiplierDmg;

  return {
    baseDamage,
    refStat: refStatKey,
    traceMultiplier,
    addMultiplierDmg
  };
}
