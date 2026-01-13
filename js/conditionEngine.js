/**
 * condition定義をもとに、現在の計算状況で有効かどうかを判定する
 *
 * @param {Object} condition - JSONで定義されたcondition
 * @param {Object} context - 現在の計算状況
 * @returns {boolean} 条件を満たすかどうか
 */
export function checkCondition(condition, context) {

  // conditionが無い場合は常時有効とみなす
  if (!condition) return true;

  switch (condition.type) {

    // 常時発動（星魂・軌跡によく使う）
    case "always":
      return true;

    // ユーザー操作でON/OFFする条件
    case "user":
      return condition.value === context.userAction;

    // 攻撃方法依存の条件（戦闘スキル時、必殺技時など）
    case "attack":
      return condition.value.includes(context.attackType);

    // 未定義のconditionは無効扱い
    default:
      return false;
  }
}
