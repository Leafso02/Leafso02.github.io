import { loadJSON } from "./loadData.js";
import { collectBuffs } from "./buffEngine.js";
import { applyBuffsToStats } from "./statEngine.js";
import { calculateDamage } from "./damageEngine.js";

/**
 * HTMLの各要素を取得
 * - ユーザー入力
 * - 計算結果表示
 */
const attackTypeSelect = document.getElementById("attackType");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const calcBtn = document.getElementById("calcBtn");
const resultElem = document.getElementById("damageResult");

/**
 * 初期ロード時に必要なJSONをすべて読み込む
 * 一度読み込めば再利用するためグローバルに保持
 */
let characterData;
let skillData;
let eidolonsData;
let tracesData;
let multipliersData;

async function init() {
  characterData = await loadJSON("data/character/characters/cerydra_character.json");
  skillData = await loadJSON("data/character/skills/cerydra_skill.json");
  eidolonsData = await loadJSON("data/character/eidolons/cerydra_eidolons.json");
  tracesData = await loadJSON("data/character/traces/cerydra_traces.json");
  multipliersData = await loadJSON("data/character/multipliers/cerydra_multiplier.json");
}

init();

/**
 * 「計算する」ボタンが押された時の処理
 */
calcBtn.addEventListener("click", () => {

  // UIから現在の入力値を取得
  const attackType = attackTypeSelect.value;
  const skillLevel = Number(skillLevelInput.value);
  const eidolonLevel = Number(eidolonLevelInput.value);

  // 現在の計算状況（condition判定用）
  const context = {
    attackType,
    userAction: null
  };

  // 発動中のバフを収集
  const buffs = collectBuffs({
    skillData,
    eidolonsData,
    tracesData,
    multiplierData: multipliersData,
    skillType: attackType,
    skillLevel,
    eidolonLevel,
    context
  });

  // キャラの基礎ステータス
  const baseStats = {
    atk: characterData.baseAtk,
    critDmg: 0,
    resPen: 0
  };

  // バフ反映後ステータス
  const finalStats = applyBuffsToStats(baseStats, buffs);

  // ダメージ計算
  const damage = calculateDamage({
    attackerStats: finalStats,
    multiplierData: multipliersData,
    skillType: attackType,
    skillLevel
  });

  // 結果を画面に表示
  resultElem.textContent = `ダメージ：${damage}`;
});
