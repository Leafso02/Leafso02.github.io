/* ===== HTML要素取得 ===== */
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const resultElem = document.getElementById("damageResult");


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

  return current;
}