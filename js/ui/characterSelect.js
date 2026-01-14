import { loadCharacterList, loadCharacter } from "./loadCharacter.js";

export async function initCharacterSelect() {
  const select = document.getElementById("characterSelect");

  select.innerHTML = "";

  const characters = await loadCharacterList();
  console.log("[characterSelect] loaded characters:", characters);

  characters.forEach(char => {
    const option = document.createElement("option");
    option.value = char.id;
    option.textContent = char.name;
    select.appendChild(option);
  });

  console.log("[characterSelect] init complete");

  // 初期キャラロード（1回だけ）
  if (characters.length > 0) {
    select.value = characters[0].id;
    await loadCharacter(characters[0].id);
  }

  // キャラ変更時
  select.addEventListener("change", async (e) => {
    await loadCharacter(e.target.value);
  });
}
