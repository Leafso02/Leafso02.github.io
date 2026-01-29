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
  eidolonLevel
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
 * operationの処理毎にケースを分ける
 * ===================== */
function applyOperation(skills, operation) {
  const { abilityOp } = operation;

  switch (abilityOp) {
    case "changeBaseType":
      changeBaseType(skills, operation);
      break;

    case "addBuffGroup":
      addBuffGroup(skills, operation);
      break;

    case "addBuffToGroup":
      addBuffToGroup(skills, operation);
      break;

    case "abilityLevelUp":
      abilityLevelUp(skills, operation);
      break;

    case "addATK":
      addATK(skills, operation);
      break;

    default:
      console.warn(`[skillModifierEngine] Unknown abilityOp: ${abilityOp}`);
  }
}

/* =====================
 * 対象スキルを取得する
 * ===================== */
function getTargetSkill(skills, targetSkill) {
  const { skillType, skillId } = targetSkill;

  const group = skills[skillType];
  if (!group || !Array.isArray(group.base)) return null;

  return group.base.find(s => s.skillId === skillId) ?? null;
}

/* =====================
 * changeBaseType
 * ===================== */
function changeBaseType(skills, operation) {
  const skill = getTargetSkill(skills, operation.targetSkill);
  if (!skill) return;

  skill.type = operation.newBaseType;
}


/* =====================
 * addBuffGroup
 * ===================== */
function addBuffGroup(skills, operation) {
  const skill = getTargetSkill(skills, operation.targetSkill);
  if (!skill) return;

  if (!skill.buffGroups) {
    skill.buffGroups = [];
  }

  skill.buffGroups.push({
    buffGroupId: operation.targetSkill.buffGroupId ?? generateBuffGroupId(skill),
    condition: operation.condition ?? null,
    buffs: structuredClone(operation.buffs)
  });
}

/* =====================
 * addBuffToGroup
 * ===================== */
function addBuffToGroup(skills, operation) {
  const skill = getTargetSkill(skills, operation.targetSkill);
  if (!skill || !skill.buffGroups) return;

  const { buffGroupId } = operation.targetSkill;
  const group = skill.buffGroups.find(bg => bg.buffGroupId === buffGroupId);
  if (!group) return;

  group.buffs.push(...structuredClone(operation.buffs));
}

/* =====================
 * abilityLevelUp
 * ===================== */
function abilityLevelUp(skills, operation) {
  const { skillType } = operation.targetSkill;
  const group = skills[skillType];
  if (!group) return;

  group.levelBonus = (group.levelBonus ?? 0) + operation.upValue;
  group.maxLevel = operation.maxLevel ?? group.maxLevel;
}

/* =====================
 * buffGroupId 自動生成
 * ===================== */
function generateBuffGroupId(skill) {
  if (!skill.buffGroups || skill.buffGroups.length === 0) return 1;
  return Math.max(...skill.buffGroups.map(b => b.buffGroupId ?? 0)) + 1;
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
