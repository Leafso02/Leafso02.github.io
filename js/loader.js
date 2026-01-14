console.log("loader.js読み込み完了")
import { initCharacterSelect } from "./ui/characterSelect.js";
import "./calc/mainCalc.js";

/**
 * ページ読み込み時にUI初期化を行う
 */
window.addEventListener("DOMContentLoaded", () => {

    // loader.jsが実行されたかのデバッグ
  console.log("[loader] DOMContentLoaded");

  // キャラクター選択プルダウンを生成する
  initCharacterSelect();
});
