/**
 * conditionCheck.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : manualBuffParser.js
 * ================================
 * condition定義をもとに、現在の計算状況で有効かどうかを判定する
 *
 * @param {Object} condition - JSONで定義されたcondition
 * @returns {boolean} 条件を満たすかどうか
 */


export function checkStatsCondition(condition, stats) {
   const value = stats[condition.stat];

  switch (condition.op) {
    case ">=": return value >= condition.value;
    case ">":  return value >  condition.value;
    case "<=": return value <= condition.value;
    case "<":  return value <  condition.value;
    default: return false;
  }
}
