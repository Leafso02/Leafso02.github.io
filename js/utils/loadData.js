/**
 * JSONファイルをfetchで読み込む共通関数
 *
 * ・path に指定された JSON を取得する
 * ・取得したレスポンスを JavaScript オブジェクトに変換する
 * ・変換後のデータを呼び出し元へ返す
 */

let current = {};

export async function loadCharacterData(characterId) {

  current.character = await loadJSON(
    `data/character/characters/${characterId}_character.json`
  );

  current.skills = await loadJSON(
    `data/character/skills/${characterId}_skill.json`
  );

  current.eidolons = await loadJSON(
    `data/character/eidolons/${characterId}_eidolons.json`
  );

  current.traces = await loadJSON(
    `data/character/traces/${characterId}_traces.json`
  );

  current.multipliers = await loadJSON(
    `data/character/multipliers/${characterId}_multiplier.json`
  );

  return current;
}

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
