/**
 * IncreaseDmgCoefEngine.js
 *
 * ・与ダメージ係数のみを算出する
 * ・ダメージ計算は行わない
 *
 * 与ダメージ係数 =
 *   1 + (属性与ダメ% + その他与ダメ%)
 */

/**
 * 与ダメージ係数を計算する
 *
 * @param {Object} params
 * @param {Array} params.buffs
 *   buffEngine.js で収集されたバフ配列
 *
 * @returns {Object}
 *   {
 *     increaseDmgCoef: number,
 *     typeDmg: number,
 *     otherDmg: number
 *   }
 */
export function calculateIncreaseDmgCoef({ buffs }) {

  let typeDmg = 0;
  let otherDmg = 0;

  buffs.forEach(buff => {
    if (buff.valueUnit !== "percent") return;

    switch (buff.valueType) {
      case "TypeDmg":
        typeDmg += buff.value;
        break;

      case "IncreaseDmg":
        otherDmg += buff.value;
        break;

      default:
        // 与ダメージ以外は無視
        break;
    }
  });

  const increaseDmgCoef = 1 + typeDmg + otherDmg;

  return {
    increaseDmgCoef,
    typeDmg,
    otherDmg
  };
}
