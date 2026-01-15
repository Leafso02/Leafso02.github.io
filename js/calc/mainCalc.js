console.log("[mainCalc] loaded");

import { loadJSON } from "./loadData.js";
import { buildContext } from "./contextBuilder.js";
import { collectAllBuffs } from "./buffEngine.js";
import { applyBuffsToStats } from "./statEngine.js";

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

/* ===== ダメージ計算 ===== */
document.getElementById("calcBtn").addEventListener("click", () => {

  const skillKey = skillSelect.value;
  const skillLevel = Number(skillLevelInput.value);
  const eidolonLevel = Number(eidolonLevelInput.value);

  const context = buildContext({
  skillType: selectedSkillType, // "basic" | "skill" | "ult"
  skills: characterSkills,
  traces: characterTraces,
  eidolons: characterEidolons,
  eidolonLevel,
  manualBuffs,
  isUserTurn: true,
});

  /**
   * ============================
   * 1. バフ収集
   * ============================
   */
  const buffs = collectAllBuffs({
    skillData: current.skills,
    eidolonsData: current.eidolons,
    tracesData: current.traces,
    skillType: skillKey,
    skillLevel,
    eidolonLevel,
    context: { attackType: skillKey }
  });

  /**
   * ============================
   * 2. 最終ステータス算出
   * ============================
   */
  const baseStats = {
    Atk: current.character.baseAtk,
    CritRate: current.character.baseCritRate ?? 0,
    CritDmg: current.character.baseCritDmg ?? 0,
    ResPen: 0
  };

  const finalStats = applyBuffsToStats(baseStats, buffs);

  /**
   * ============================
   * 3. 各 Engine から値を取得
   * ============================
   */
  const baseDmgResult = calculateBaseDamage({
    skillData: current.skills,
    multiplierData: current.multipliers,
    finalStats,
    skillKey,
    skillLevel
  });

  const critCoefResult = calculateCritCoef({
    finalStats
  });

  const increaseDmgCoefResult = calculateIncreaseDmgCoef({
    buffs
  });

  /**
   * ============================
   * 3.5. デバッグ
   * ============================
   */
  console.log(
    "skillData:" + skillData + 
    "eidolonsData:" + eidolonsData + 
    "tracesData:" + skilltracesDataData + 
    "skillType:" + skillType + 
    "skillLevel:" + skillLevel + 
    "eidolonLevel:" + eidolonLevel + 
    "context:" + context + 
    "Atk:" + Atk + 
    "CritRate:" + CritRate + 
    "CritDmg:" + CritDmg + 
    "multiplierData:" + multiplierData + 
    "finalStats:" + finalStats + 
    "skillKey:" + skillKey + 
    "buffs:" + buffs
  )

  const debugElem = document.getElementById("debugOutput");


  /**
   * ============================
   * 4. 最終ダメージ計算
   * ============================
   */
  const finalDamage =
    baseDmgResult.baseDamage *
    critCoefResult.critCoef *
    increaseDmgCoefResult.increaseDmgCoef;

  /**
   * ============================
   * 5. 表示
   * ============================
   */
  resultElem.textContent = `ダメージ：${Math.floor(finalDamage)}`;

  /**
   * ============================
   * 6. デバッグ出力（重要）
   * ============================
   */
  console.log("[Damage Debug]", {
    baseDamage: baseDmgResult,
    critCoef: critCoefResult,
    increaseDmgCoef: increaseDmgCoefResult
  });

  const debugData = {
  skill: {
    skillKey,
    skillLevel
  },

  baseDamage: {
    refStat: baseDmgResult.refStat,
    refStatValue: finalStats[baseDmgResult.refStat],
    traceMultiplier: baseDmgResult.traceMultiplier,
    increaseDamage: baseDmgResult.increaseDamage,
    baseDamage: baseDmgResult.baseDamage
  },

  crit: {
    critRate: critCoefResult.critRate,
    critDmg: critCoefResult.critDmg,
    critCoef: critCoefResult.critCoef
  },

  increaseDamage: {
    typeDmg: increaseDmgCoefResult.typeDmg,
    otherDmg: increaseDmgCoefResult.otherDmg,
    increaseDmgCoef: increaseDmgCoefResult.increaseDmgCoef
  },

  final: {
    damage:
      baseDmgResult.baseDamage *
      critCoefResult.critCoef *
      increaseDmgCoefResult.increaseDmgCoef
  }
};

debugElem.textContent = JSON.stringify(debugData, null, 2);

});