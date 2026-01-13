/**
 * JSONファイルをfetchで読み込む共通関数
 */
export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

/**
 * charactersフォルダにあるキャラ一覧を定義
 * ※ 本番ではindex.jsonを用意するのが理想
 */
export const characterList = [
  {
    id: "cerydra",
    name: "ケリュドラ"
  }
];