import { loadJSON, characterList } from "./loadData.js";
import { collectBuffs } from "./buffEngine.js";
import { applyBuffsToStats } from "./statEngine.js";
import { calculateDamage } from "./damageEngine.js";

/* ===== HTML要素取得 ===== */
const characterSelect = document.getElementById("characterSelect");
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const resultElem = document.getElementById("damageResult");

/* ===== 現在選択中のキャラデータ ===== */
let current = {};

/**
 * 初期化処理
 * - キャラ一覧をUIに反映
 */
async function init() {
  characterList.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    characterSelect.appendChild(option);
  });

  await loadCharacter(characterList[0].id);
}

/**
 * キャラクター変更時の処理
 */
characterSelect.addEventListener("change", async e => {
  await loadCharacter(e.target.value);
});

/**
 * キャラデータ一式をロードする
 */
async function loadCharacter(characterId) {
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

  buildSkillSelect();
}

/**
 * 「攻撃可能なスキルのみ」セレクトに反映
 */
function buildSkillSelect() {
  skillSelect.innerHTML = "";

  Object.entries(current.skills).forEach(([skillType, data]) => {
    if (!data.base) return;

    data.base.forEach(skill => {
      if (skill.type === "atkOnly" || skill.type === "both") {
        const option = document.createElement("option");
        option.value = skillType;
        option.textContent = skill.name;
        skillSelect.appendChild(option);
      }
    });
  });
}

/**
 * ダメージ計算ボタン
 */
document.getElementById("calcBtn").addEventListener("click", () => {

  const skillType = skillSelect.value;
  const skillLevel = Number(skillLevelInput.value);
  const eidolonLevel = Number(eidolonLevelInput.value);

  const buffs = collectBuffs({
    skillData: current.skills,
    eidolonsData: current.eidolons,
    tracesData: current.traces,
    multiplierData: current.multipliers,
    skillType,
    skillLevel,
    eidolonLevel,
    context: { attackType: skillType }
  });

  const baseStats = {
    atk: current.character.baseAtk,
    critDmg: 0,
    resPen: 0
  };

  const finalStats = applyBuffsToStats(baseStats, buffs);

  const dmg = calculateDamage({
    attackerStats: finalStats,
    multiplierData: current.multipliers,
    skillType,
    skillLevel
  });

  resultElem.textContent = `ダメージ：${Math.floor(dmg)}`;
});

init();
