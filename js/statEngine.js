/**
 * バフを適用して最終ステータスを生成する
 *
 * @param {Object} baseStats - 基礎ステータス
 * @param {Array} buffs - 発動中バフ一覧
 * @returns {Object} バフ適用後ステータス
 */
export function applyBuffsToStats(baseStats, buffs) {

  // 元データを壊さないようコピー
  const stats = { ...baseStats };

  for (const buff of buffs) {
    switch (buff.valueType) {

      // 攻撃力バフ
      case "Atk":
        stats.atk += buff.valueUnit === "percent"
          ? stats.atk * buff.resolvedValue
          : buff.resolvedValue;
        break;

      // 会心ダメージ
      case "CritDmg":
        stats.critDmg = (stats.critDmg ?? 0) + buff.resolvedValue;
        break;

      // 耐性貫通
      case "ResPen":
        stats.resPen = (stats.resPen ?? 0) + buff.resolvedValue;
        break;
    }
  }

  return stats;
}
