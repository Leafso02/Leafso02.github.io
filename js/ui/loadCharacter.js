/**
 * キャラクター一覧データを取得する
 *
 * ・UIで使用するための「軽量キャラクター一覧」を読み込む
 * ・この関数は「プルダウンに表示するためだけ」に存在する
 */
export async function loadCharacterList() {

  // キャラクター一覧JSONを取得する
  const response = await fetch("./data/character/index/characters.json");

  // 読み込み失敗時は即エラー（表示されない原因を隠さない）
  if (!response.ok) {
    throw new Error("キャラクター一覧データの取得に失敗");
  }

  // JSON → JavaScript配列へ変換
  return await response.json();
}
