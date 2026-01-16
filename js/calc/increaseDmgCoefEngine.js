/**
 * increaseDmgCoefEngine.js
 *
 * ・与ダメージ係数のみを算出する
 * ・statEngine には一切依存しない
 */

export function calculateIncreaseDmgCoef(buffs) {

  let typeDmg = 0;   // 属性与ダメ%
  let otherDmg = 0;  // その他与ダメ%

  buffs.forEach(buff => {
    switch (buff.valueType) {

      case "IncreaseTypeDmg":
        typeDmg += buff.value;
        break;

      case "IncreaseDmg":
        otherDmg += buff.value;
        break;

      default:
        // 無関係なバフは無視
        break;
    }
  });

  const increaseDmgCoef = 1 + typeDmg + otherDmg;

  return {
    increaseDmgCoef,
    used: {
      typeDmg,
      otherDmg
    }
  };
}
