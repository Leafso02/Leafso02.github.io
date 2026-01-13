// JSONファイルをfetchして読み込む共通関数
// path: JSONファイルのパス
export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}
