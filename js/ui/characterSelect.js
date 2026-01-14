import { loadCharacterList } from "./loadCharacter.js";

/**
 * キャラクター選択プルダウンを初期化する
 *
 * ・characters.json から取得したキャラ一覧を
 * ・<select>要素に<option>として追加する
 */
export async function initCharacterSelect() {

  const select = document.getElementById("characterSelect");
  const skillSelect = document.getElementById("skillSelect");

  // キャラ変更時
  select.addEventListener("change", async (e) => {

    const characterId = e.target.value;

    // ① 選択されたキャラの全データを計算側にロード
    await loadCharacterData(characterId);

    // ② 攻撃可能なスキル一覧を取得
    const skills = getAttackableSkills();

    // ③ スキル選択UIを更新
    skillSelect.innerHTML = "";

    skills.forEach(skill => {

      const option = document.createElement("option");
      option.value = skill.skillType;
      option.textContent = skill.name;

      skillSelect.appendChild(option);
    });
  });

  // プルダウンを初期化
  select.innerHTML = "";

  // キャラクター一覧を取得
  const characters = await loadCharacterList();

    console.log("[characterSelect] loaded characters:", characters);

  // キャラクターを1件ずつ<option>として追加
  characters.forEach(char => {
    
    console.log("[characterSelect] add option:", char);

    // option要素を生成
    const option = document.createElement("option");

    // valueにはキャラクターID（後続処理用）
    option.value = char.id;

    // 表示テキストとしてキャラ名を設定
    option.textContent = char.name;

    // selectに追加
    select.appendChild(option);
  });
    console.log("[characterSelect] init complete");
}
