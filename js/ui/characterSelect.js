import { loadCharacterList } from "./loadCharacter.js";

/**
 * キャラクター選択プルダウンを初期化する
 *
 * ・characters.json から取得したキャラ一覧を
 * ・<select>要素に<option>として追加する
 */
export async function initCharacterSelect() {

  // HTML上の<select>を取得
  const select = document.getElementById("characterSelect");

  // selectが無い＝HTML設計ミス
  if (!select) {
    console.error("characterSelect がHTMLに存在しません");
    return;
  }

  // プルダウンを初期化
  select.innerHTML = "";

  // キャラクター一覧を取得
  const characters = await loadCharacterList();

  // キャラクターを1件ずつ<option>として追加
  characters.forEach(char => {

    // option要素を生成
    const option = document.createElement("option");

    // valueにはキャラクターID（後続処理用）
    option.value = char.id;

    // 表示テキストとしてキャラ名を設定
    option.textContent = char.name;

    // selectに追加
    select.appendChild(option);
  });
}
