/**
 * increaseDmgCoefEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : なし
 * ================================
 * ・与ダメージ係数のみを算出する
 * ・buffEngine が返す「集計済みオブジェクト」を参照する
 */

export function calculateIncreaseDmgCoef(buffs) {

  // buffs 例:
  // {
  //   IncreaseDmg: { flat: 0, percent: 0.3 },
  //   IncreaseTypeDmg: { flat: 0, percent: 0.2 }
  // }

  const typeDmg =
    buffs.IncreaseTypeDmg?.percent ?? 0;

  const otherDmg =
    buffs.IncreaseDmg?.percent ?? 0;

  const increaseDmgCoef = 1 + typeDmg + otherDmg;

  return {
    increaseDmgCoef,
    used: {
      typeDmg,
      otherDmg
    }
  };
}
