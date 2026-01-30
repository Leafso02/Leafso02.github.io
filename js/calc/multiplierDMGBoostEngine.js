/**
 * multiplierDMGBoostEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : なし
 * ================================
 * ・与ダメージ係数のみを算出する
 * ・buffEngine が返す「集計済みオブジェクト」を参照する
 */

export function calculateDMGBoostMultiplier(buffs) {

  // buffs 例:
  // {
  //   AllDMGBoost: { flatValue: 0, value: 0.3 },
  //   ElementalDMGBoost: { flatValue: 0, value: 0.2 }
  // }

  const typeDmg =
    buffs.ElementalDMGBoost?.value ?? 0;

  const otherDmg =
    buffs.AllDMGBoost?.value ?? 0;

  const DMGBoostMultiplier = 1 + typeDmg + otherDmg;

  return {
    DMGBoostMultiplier,
    used: {
      typeDmg,
      otherDmg
    }
  };
}
