// skillModifierEngine.js

import { setModifiedSkills } from "./modifiedSkillStore.js";

/**
 * 星魂・追加能力をスキルに適用し、modifiedSkillStore に保存する
 */
export function applySkillModifiers({
  role,               // "attacker" | "ally"
  allyIndex = 0,      // ally の場合のみ使用
  characterId,
  baseSkills,         // skill.json の skills
  eidolons = [],      // 星魂配列
  bonusAbilities = [],// 追加能力配列
  eidolonLevel,
}) {
  // 深いコピー（元データ破壊防止）
  const skills = structuredClone(baseSkills);

  /* =====================
   * 星魂適用
   * ===================== */

  eidolons.forEach(eidolon => {
    if (eidolon.level > eidolonLevel) return;
    applyOperations(skills, eidolon.operations);
  });

  /* =====================
   * 追加能力適用
   * ===================== */

  bonusAbilities.forEach(ability => {
    applyOperations(skills, ability.operations);
  });

  /* =====================
   * 保存
   * ===================== */

  setModifiedSkills(role, allyIndex, {
    characterId,
    skills,
    meta: {
      eidolonLevel,
      appliedBonusAbilities: bonusAbilities.map(b => b.id ?? "unknown"),
    },
  });
}

/* =====================
 * operations 適用本体
 * ===================== */

function applyOperations(skills, operations = []) {
  operations.forEach(op => {
    switch (op.op) {
      case "addBuffToGroup":
        addBuffToGroup(skills, op);
        break;

      default:
        console.warn("未対応の operation:", op.op);
    }
  });
}

/* =====================
 * addBuffToGroup
 * ===================== */

function addBuffToGroup(skills, operation) {
  const { target, buffs } = operation;
  const { skillType, skillId, buffGroupId } = target;

  const skillGroup = skills[skillType];
  if (!skillGroup?.base) return;

  const skill = skillGroup.base.find(s => s.skillId === skillId);
  if (!skill) return;

  const buffGroup = skill.buffGroups?.find(bg => bg.id === buffGroupId);
  if (!buffGroup) return;

  buffGroup.buffs.push(...structuredClone(buffs));
}
