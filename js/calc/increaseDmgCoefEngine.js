/**
 * increaseDmgCoefEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : なし
 * ================================
 * ・与ダメージ係数のみを算出する
 * ・buffEngine が返す「集計済みオブジェクト」を参照する
 */

export function calculateAllDMGBoostCoef(buffs) {

  // buffs 例:
  // {
  //   AllDMGBoost: { flat: 0, percent: 0.3 },
  //   ElementalDMGBoost: { flat: 0, percent: 0.2 }
  // }

  const typeDmg =
    buffs.ElementalDMGBoost?.percent ?? 0;

  const otherDmg =
    buffs.AllDMGBoost?.percent ?? 0;

  const increaseDmgCoef = 1 + typeDmg + otherDmg;

  return {
    increaseDmgCoef,
    used: {
      typeDmg,
      otherDmg
    }
  };
}
