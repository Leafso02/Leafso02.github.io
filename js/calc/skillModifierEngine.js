/**
 * skillModifierEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : structuredClone.js
 * ================================
 * 
 * 星魂・追加能力をスキルに適用し、modifiedSkillStore に保存する
 */

import structuredClone from "../utils/structuredClone.js";

/* =====================
 * baseSkills に eidolons を適用した「仮スキル」を生成する
 * ===================== */
export function applyEidolonsToSkills({
  baseSkills,
  eidolons,
  eidolonLevel,
  skillLevel
}) {

    const skills = structuredClone(baseSkills);

  // 星魂が0だった場合そのまま返す
  if (!Array.isArray(eidolons) || eidolonLevel <= 0) {
    return skills;
  }

  for (const eidolon of eidolons) {
    if (eidolon.level > eidolonLevel) continue;
    if (!eidolon.operations) continue;

    for (const operation of eidolon.operations) {
      applyOperation(skills, operation);
    }
  }

  return skills;
}


/* =====================
 * opの処理毎にケースを分ける
 * ===================== */
function applyOperation(skills, operation) {
  const { op } = operation;

  switch (op) {
    case "changeBaseType":
      changeBaseType(skills, operation);
      break;

    case "addBuffGroup":
      addBuffGroup(skills, operation);
      break;

    case "addBuffToGroup":
      addBuffToGroup(skills, operation);
      break;

    case "addATK":
      addATK(skills, operation);
      break;

    default:
      console.warn(`[skillModifierEngine] Unknown op: ${op}`);
  }
}

/* =====================
 * 対象スキルを取得する
 * ===================== */
function getTargetSkill(skills, target) {
  const { skillType, skillId } = target;

  const skillGroup = skills[skillType];
  if (!skillGroup) return null;

  return skillGroup.base.find(s => s.skillId === skillId) ?? null;
}

/* =====================
 * changeBaseType
 * ===================== */
function changeBaseType(skills, operation) {
  const skill = getTargetSkill(skills, operation.target);
  if (!skill) return;

  skill.type = operation.newBaseType;
}

/* =====================
 * addBuffGroup
 * ===================== */
function addBuffGroup(skills, operation) {
  const skill = getTargetSkill(skills, operation.target);
  if (!skill) return;

  if (!skill.buffs) {
    skill.buffs = [];
  }

  skill.buffs.push({
    condition: operation.condition,
    buffs: structuredClone(operation.buffs)
  });
}

/* =====================
 * addBuffToGroup
 * ===================== */
function addBuffToGroup(skills, operation) {
  const skill = getTargetSkill(skills, operation.target);
  if (!skill || !skill.buffs) return;

  const { buffGroupIndex } = operation.target;
  const group = skill.buffs[buffGroupIndex];
  if (!group) return;

  group.buffs.push(...structuredClone(operation.buffs));
}

/* =====================
 * addATK
 * ===================== */
function addATK(skills, operation) {
  const skill = getTargetSkill(skills, operation.target);
  if (!skill) return;

  if (!skill.atk) {
    skill.atk = [];
  }

  skill.atk.push(structuredClone(operation.atk));
}
