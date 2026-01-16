// modifiedSkillStore.js

/**
 * 星魂・追加能力が適用されたスキル定義を保持するストア
 * skill.json と同じ形式で保存する
 */

export const modifiedSkillStore = {
  attacker: null,      // { characterId, skills, meta }
  allies: [null, null, null], // 将来用
};

/* =====================
 * setter
 * ===================== */

export function setModifiedSkills(role, index, data) {
  if (role === "attacker") {
    modifiedSkillStore.attacker = data;
    return;
  }

  if (role === "ally") {
    modifiedSkillStore.allies[index] = data;
    return;
  }

  throw new Error(`Unknown role: ${role}`);
}

/* =====================
 * getter
 * ===================== */

export function getModifiedSkills(role, index = 0) {
  if (role === "attacker") {
    return modifiedSkillStore.attacker;
  }

  if (role === "ally") {
    return modifiedSkillStore.allies[index];
  }

  throw new Error(`Unknown role: ${role}`);
}
