/**
 * mainCalc.js
 * ================================
 * 上位ファイル : index.html
 * 下位ファイル : buffEngine.js
 *               statsEngine.js
 *               baseDmgEngine.js
 *               critCoefEngine.js
 *               increaseDmgCoefEngine.js
 * ================================
 * ・与ダメージ係数のみを算出する
 * ・buffEngine が返す「集計済みオブジェクト」を参照する
 */

console.log("[mainCalc] loaded");

import { getCharacterData } from "../ui/loadCharacter.js";
import { applyEidolonsToSkills } from "./skillModifierEngine.js";
import { collectAllBuffs } from "./buffEngine.js";
import { calculateFinalStats } from "./statEngine.js";
import { calculateBaseDamage } from "./baseDmgEngine.js";
import { calculateCritCoef } from "./multiplierCRITEngine.js";
import { calculateAllDMGBoostCoef } from "./multiplierDMGBoostEngine.js";

/* ===== HTML要素取得 ===== */
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const resultElem = document.getElementById("damageResult");


/* =====================
 * 計算ボタン
 * ===================== */

calcBtn.addEventListener("click", () => {

  const currentCharacter = getCharacterData()

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


/* =====================
 * 星魂、追加能力適用後の仮スキル生成
 * ===================== */
console.log(currentCharacter.eidolons);

const modifiedSkills = applyEidolonsToSkills({
  baseSkills: currentCharacter.skills,     // skill.json 由来
  eidolons: currentCharacter.eidolons,      // 適用済み星魂だけ
  eidolonLevel,
  skillLevel
});

  console.log("[mainCalc] modifiedSkills", modifiedSkills);



  /* ==========
   * バフ収集
   * ========== */

  console.log("collectAllBuffs");
  console.log(currentCharacter.skills);
  console.log(currentCharacter.traces);
  console.log(currentCharacter.eidolons);
  console.log(skillType);
  console.log(eidolonLevel);

  const buffs = collectAllBuffs({
    skills: modifiedSkills,
    skillType
  });

  console.log("[mainCalc] buffs", buffs);

  /* ==========
   * 基礎ステータス
   * ========== */

  const baseStats = {
    HP: currentCharacter.character.baseHP,
    ATK: currentCharacter.character.baseATK,
    DEF: currentCharacter.character.baseDEF,
    SPD: currentCharacter.character.baseSPD,
    CRITRate: 0.05,
    CRITDMG: 0.5
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
    skillData: currentCharacter.skills,
    multiplierData: currentCharacter.multipliers,
    finalStats,
    skillKey: skillType,
    skillLevel,
    buffs
  });

  console.log("[mainCalc] baseDamage", baseDmgResult);

  /* ==========
   * 会心係数
   * ========== */

  const critCoefResult = calculateCritCoef(
    finalStats
  );

  console.log("[mainCalc] CritCoef", critCoefResult, critCoefResult);

  /* ==========
   * 与ダメ係数
   * ========== */

  const increaseDmgResult = calculateAllDMGBoostCoef(buffs);

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