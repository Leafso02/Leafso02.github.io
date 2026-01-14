/**
 * JSONファイルをfetchで読み込む共通関数
 *
 * ・path に指定された JSON を取得する
 * ・取得したレスポンスを JavaScript オブジェクトに変換する
 * ・変換後のデータを呼び出し元へ返す
 */
export async function loadJSON(path) {

  // 指定されたパスのファイルを取得する
  const res = await fetch(path);

  // HTTPエラー（404など）の場合、ここで止める
  // → 「HTMLをJSONとして読んで落ちる事故」を防ぐ
  if (!res.ok) {
    throw new Error(`JSONの取得に失敗: ${path}`);
  }

  // JSON文字列をJavaScriptオブジェクトに変換して返す
  return await res.json();
}
