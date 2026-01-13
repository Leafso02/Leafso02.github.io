/**
 * 倍率データから値を取得する
 *
 * @param {Object} multiplierData - multiplier.json全体
 * @param {string} table - 参照するテーブル名（例: "ultimate"）
 * @param {number} level - スキルレベル
 * @param {string} id - 倍率ID（例: "x"）
 * @returns {number} 倍率値（存在しなければ0）
 */
export function getMultiplier(multiplierData, table, level, id) {

  // テーブルが存在しない場合は倍率0
  const entry = multiplierData[table];
  if (!entry) return 0;

  // 指定スキルレベルのデータを取得
  const lv = entry.levels.find(l => l.level === level);
  if (!lv) return 0;

  // 倍率IDが一致するものを検索
  const multiplier = lv.multipilers.find(m => m.id === id);

  // 見つかれば倍率、なければ0
  return multiplier ? multiplier.value : 0;
}
