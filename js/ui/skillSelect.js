/**
 * skillSelect.js
 * ================================
 * ・攻撃可能スキルを select に反映
 * ・使用スキル変更時にスキルLvUIを制御
 * ================================
 */

/* =====================
 * デフォルトスキルLv
 * ===================== */
const DEFAULT_SKILL_LEVEL = {
  basicATK: 6,
  skill: 10,
  ultimate: 10,
  talent: 10,
};

/* =====================
 * 攻撃可能スキル一覧を反映
 * ===================== */
export function updateSkillSelect(skills) {
  console.log("[skillSelect] updateSkillSelect called");

  const skillSelect = document.getElementById("skillSelect");
  skillSelect.innerHTML = "";

  const attackableSkills = getAttackableSkills(skills);

  attackableSkills.forEach(skill => {
      const option = document.createElement("option");
      option.value = skill.skillKey;
      option.textContent = skill.categoryLabel;
      skillSelect.appendChild(option);
  });
}

/* =====================
 * 攻撃に使用可能なスキル抽出
 * ===================== */
export function getAttackableSkills(skills) {
  const result = [];

  Object.entries(skills).forEach(([skillKey, data]) => {
    if (!data.base) return;

    // skillId毎に抽出
    data.base.forEach(skill => {
          if (skill.type === "atkOnly" || skill.type === "both") {
          result.push({
          skillKey,                         // "basicATK" / "skill" / "ultimate" など
          categoryLabel: skill.label,   // 日本語表示
          skillName: skill.name,
        });
      }
    });
  });

  return result;
}

/* =====================
 * 有効なスキルLv一覧を取得
 * ===================== */
function getValidSkillLevels(multipliers, skillType) {
  const multiPlierTable = multipliers[skillType];
  if (!multiPlierTable?.levels) return [];

  return multiPlierTable.levels
    .map(lv => lv.level)
    .sort((a, b) => a - b);
}

/* =====================
 * 使用スキル変更時のLv制御
 * ===================== */
export function bindSkillLevelControl(multipliers) {
  const skillSelect = document.getElementById("skillSelect");
  const levelInput = document.getElementById("skillLevel");

  if (!skillSelect || !levelInput) return;

  const sync = () => {
    const skillType = skillSelect.value;
    adjustSkillLevelInput(multipliers, skillType, levelInput);
  };

  // スキル変更時
  skillSelect.addEventListener("change", sync);

  // ★ 初期表示時に1回実行
  sync();

  // Lv直接入力時
  levelInput.addEventListener("change", () => {
    const validLevels = getValidSkillLevels(multipliers, skillSelect.value);
    if (!validLevels.length) return;

    const lv = Number(levelInput.value);
    if (!validLevels.includes(lv)) {
      levelInput.value = findNearestLevel(validLevels, lv);
    }
  });
}


/* =====================
 * Lv input の調整
 * ===================== */
function adjustSkillLevelInput(multipliers, skillType, levelInput) {
  const validLevels = getValidSkillLevels(multipliers, skillType);
  if (!validLevels.length) return;

  const min = validLevels[0];
  const max = validLevels[validLevels.length - 1];

  levelInput.min = min;
  levelInput.max = max;
  levelInput.step = 1;

  let targetLv = DEFAULT_SKILL_LEVEL[skillType] ?? min;

  if (!validLevels.includes(targetLv)) {
    targetLv = findNearestLevel(validLevels, targetLv);
  }

  levelInput.value = targetLv;
}

/* =====================
 * 最も近いLvを探す
 * ===================== */
function findNearestLevel(levels, target) {
  return levels.reduce((prev, cur) =>
    Math.abs(cur - target) < Math.abs(prev - target) ? cur : prev
  );
}
