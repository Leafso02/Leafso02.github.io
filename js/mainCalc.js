import { loadJSON } from "./loadData.js";
import { collectBuffs } from "./buffEngine.js";
import { applyBuffsToStats } from "./statEngine.js";
import { calculateDamage } from "./damageEngine.js";

/**
 * 計算全体のエントリーポイント
 * UIから呼ばれる想定
 */
async function main() {

  // 各種データ読み込み
  const character = await loadJSON("data/character/characters/cerydra_character.json");
  const skills = await loadJSON("data/character/skills/cerydra_skill.json");
  const eidolons = await loadJSON("data/character/eidolons/cerydra_eidolons.json");
  const traces = await loadJSON("data/character/traces/cerydra_traces.json");
  const multipliers = await loadJSON("data/character/multipliers/cerydra_multiplier.json");

  // 現在の計算状況（UI入力に相当）
  const context = {
    attackType: "ultimate",
    userAction: "userAct"
  };

  // 発動中バフ収集
  const buffs = collectBuffs({
    skillData: skills,
    eidolonsData: eidolons,
    tracesData: traces,
    multiplierData: multipliers,
    skillType: "ultimate",
    skillLevel: 10,
    eidolonLevel: 4,
    context
  });

  // 基礎ステータス
  const baseStats = {
    atk: character.baseAtk,
    critDmg: 0
  };

  // バフ反映
  const finalStats = applyBuffsToStats(baseStats, buffs);

  // ダメージ計算
  const damage = calculateDamage({
    attackerStats: finalStats,
    multiplierData: multipliers,
    skillType: "ultimate",
    skillLevel: 10
  });

  console.log("最終ダメージ:", damage);
}

main();
