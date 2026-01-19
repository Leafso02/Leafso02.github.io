console.log("[mainCalc] loaded");

import { loadJSON } from "./loadData.js";
import { collectAllBuffs } from "./buffEngine.js";
import { calculateFinalStats } from "./statEngine.js";
import { calculateBaseDamage } from "./baseDmgEngine.js";
import { calculateCritCoef } from "./critCoefEngine.js";
import { calculateIncreaseDmgCoef } from "./increaseDmgCoefEngine.js";

/* ===== HTML要素取得 ===== */
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const resultElem = document.getElementById("damageResult");

/* ===== 現在ロード中のキャラデータ =====
 * ・characterSelect 側から指定されたキャラIDを元に構築される
 */
let current = {};

/**
 * キャラIDを受け取り、計算に必要な全JSONを読み込む
 *
 * ・characterId：選択されたキャラのID
 * ・読み込んだデータは current に集約する
 */
export async function loadCharacterData(characterId) {

  current.character = await loadJSON(
    `data/character/characters/${characterId}_character.json`
  );

  current.skills = await loadJSON(
    `data/character/skills/${characterId}_skill.json`
  );

  current.eidolons = await loadJSON(
    `data/character/eidolons/${characterId}_eidolons.json`
  );

  current.traces = await loadJSON(
    `data/character/traces/${characterId}_traces.json`
  );

  current.multipliers = await loadJSON(
    `data/character/multipliers/${characterId}_multiplier.json`
  );
}

/**
 * 攻撃に使用可能なスキルだけを skillSelect に反映する
 *
 * ・current.skills の内容を参照
 * ・攻撃不可スキルは除外
 */
/**
 * 現在ロードされているキャラの
 * 「攻撃に使用できるスキル一覧」を生成して返す
 *
 * ・UI側はこの戻り値をそのまま select に反映する
 */
export function getAttackableSkills() {
  const result = [];

  Object.entries(current.skills).forEach(([skillKey, data]) => {

    if (!data.base) return;

    data.base.forEach(skill => {

 if (skill.type === "atkOnly" || skill.type === "both") {
        result.push({
          skillKey,                 // 例: "basicATK"
          categoryLabel: data.skillLabel || "その他", // JSON の skillLabel をカテゴリとして使用
          skillName: skill.name
        });
      }
    });
  });

  return result;
}

/* =====================
 * 計算ボタン
 * ===================== */

calcBtn.addEventListener("click", () => {

  /* ==========
   * ユーザー入力
   * ========== */

  const skillType = skillSelect.value;     // "basicATK" 等
  const skillLevel = Number(skillLevelInput.value);
  const eidolonLevel = Number(eidolonLevelInput.value);

  console.log("[mainCalc] input", {
    skillType,
    skillLevel,
    eidolonLevel
  });

  /* ==========
   * バフ収集
   * ========== */

console.log("collectAllBuffs");
console.log(current.skills);
console.log(current.traces);
console.log(current.eidolons);
console.log(skillType);
console.log(eidolonLevel);

  const buffs = collectAllBuffs({
    skills: current.skills,
    traces: current.traces,
    eidolons: current.eidolons,
    skillType,
    eidolonLevel,
    // isUserTurn: true
    // manualBuffs: []
  });

  console.log("[mainCalc] buffs", buffs);

  /* ==========
   * 基礎ステータス
   * ========== */

  const baseStats = {
    Hp: current.character.baseHp,
    Atk: current.character.baseAtk,
    Def: current.character.baseDef,
    Spd: current.character.baseSpd,
    CritRate: current.character.critRate || 0,
    CritDmg: current.character.critDmg || 0
  };

  /* ==========
   * ステータス計算
   * ========== */

  const finalStats = calculateFinalStats(baseStats, buffs);

  console.log("[mainCalc] finalStats", finalStats);

  /* ==========
   * ダメージ基礎値
   * ========== */

  const baseDmgResult = calculateBaseDamage({
    skillData: current.skills,
    multiplierData: current.multipliers,
    finalStats,
    skillKey: skillType,
    skillLevel
  });

  console.log("[mainCalc] baseDamage", baseDmgResult);

  /* ==========
   * 会心係数
   * ========== */

  const critCoefResult = calculateCritCoef({
    finalStats
  });

  console.log("[mainCalc] CritCoef", critCoefResult, critCoefResult);

  /* ==========
   * 与ダメ係数
   * ========== */

  const increaseDmgResult = calculateIncreaseDmgCoef(buffs);

  console.log("[mainCalc] increaseDmgCoef", increaseDmgResult);

  /* ==========
   * 最終計算
   * ========== */

  const damage =
    baseDmgResult.baseDamage *
    critCoefResult.critCoef *
    increaseDmgResult.increaseDmgCoef;

  console.log("[mainCalc] finalDamage", damage);

  resultElem.textContent = `ダメージ：${Math.floor(damage)}`;
});