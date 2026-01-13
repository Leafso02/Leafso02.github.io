/**
 * JSONファイルを非同期で読み込むユーティリティ
 * - fetch失敗時にエラーを投げることで、データ欠損を即検知する
 * - character / skill / eidolons / traces / multipliers 全て共通で使用
 */
export async function loadJSON(path) {
  // 指定パスのJSONを取得
  const res = await fetch(path);

  // 読み込み失敗時は例外を投げる
  if (!res.ok) {
    throw new Error(`Failed to load JSON: ${path}`);
  }

  // JSONとしてパースして返却
  return await res.json();
}
