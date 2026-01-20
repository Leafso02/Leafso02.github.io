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
  normal: 6,
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

    data.base.forEach(skill => {
      if (skill.type === "atkOnly" || skill.type === "both") {
        result.push({
          skillKey,                         // "normal" / "skill" / "ultimate" など
          categoryLabel: data.skillLabel,   // 日本語表示
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


  let targetLv = DEFAULT_SKILL_LEVEL[skillType] ?? validLevels[0];

    // 有効レベルに含まれていればそれを使う
  if (validLevels.includes(desired)) {
    return desired;
  }

  // 含まれていなければ一番近い値
  return validLevels.reduce((prev, curr) =>
    Math.abs(curr - desired) < Math.abs(prev - desired)
      ? curr
      : prev
  );

  // if (!validLevels.includes(targetLv)) {
  //   targetLv = findNearestLevel(validLevels, targetLv);
  // }

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
