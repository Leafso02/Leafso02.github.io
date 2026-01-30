console.log("loader.js読み込み完了")
import { initCharacterSelect } from "./ui/characterSelect.js";
import { initManualBuffUI } from "./ui/manualBuffUi.js";
import "./utils/loadCharacterData.js";
import "./calc/mainCalc.js";
import "./ui/enemyStat.js"

/**
 * ページ読み込み時にUI初期化を行う
 */
window.addEventListener("DOMContentLoaded", () => {

    // loader.jsが実行されたかのデバッグ
  console.log("[loader] DOMContentLoaded");

  // キャラクター選択プルダウンを生成する
  initCharacterSelect();

  // 手動バフの入力エリアを生成
  initManualBuffUI();

  // 敵情報エリアを生成
});
