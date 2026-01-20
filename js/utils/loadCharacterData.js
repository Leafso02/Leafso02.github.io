import { loadJSON } from "./loadData.js";

export async function loadCharacter(characterId) {

  console.log("loadCharacterの呼び出し成功");

  // キャラ関連JSONをすべてロードし、current を構築
   const characterData = await loadCharacterData(characterId);

  // ↑で current.skills が揃ったので、
  // それを元に攻撃可能スキル一覧をUIに反映する
  updateSkillSelect(characterData.skills);
}