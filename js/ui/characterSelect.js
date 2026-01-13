import { loadCharacterIndex } from "../loadCharacters.js";

/**
 * キャラクター選択プルダウンを初期化する
 */
export async function initCharacterSelect() {
  const select = document.getElementById("characterSelect");
  const characters = await loadCharacterIndex();

  // 初期化
  select.innerHTML = "";

  characters.forEach(char => {
    const option = document.createElement("option");
    option.value = char.id;
    option.textContent = char.name;
    select.appendChild(option);
  });
}
