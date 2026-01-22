/**
 * multiplierEngine.js
 * ================================
 * 上位ファイル : baseDmgEngine.js
 * 下位ファイル : なし
 * ================================
 * multiplier.json から倍率を取得する
 */

/**
 * スキル倍率を取得する
 *
 * @param {Object} multiplierData multiplier.json
 * @param {string} skillType "basicATK" | "skill" | "ultimate" | "talent"
 * @param {number} skillLevel
 * @param {string} id "x" | "y" など（デフォルト: "x"）
 * @returns {number}
 */
export function getMultiplierValue(
  multiplierData,
  skillType,
  skillLevel,
  id = "x"
) {
  const skillTable = multiplierData[skillType];
  if (!skillTable) {
    throw new Error(`倍率テーブルが存在しません: ${skillType}`);
  }

  const levelEntry = skillTable.levels.find(
    entry => entry.level === skillLevel
  );
  if (!levelEntry) {
    throw new Error(
      `倍率レベルが見つかりません: ${skillType} Lv.${skillLevel}`
    );
  }

  const multiplier = levelEntry.multipilers.find(
    m => m.id === id
  );
  if (!multiplier) {
    throw new Error(
      `倍率IDが見つかりません: ${skillType} Lv.${skillLevel} (${id})`
    );
  }

  return multiplier.value;
}
