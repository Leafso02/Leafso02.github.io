console.log("loader.js読み込み完了")
import { initCharacterSelect } from "./characterSelect.js";
/**
 * ページ読み込み時にUI初期化を行う
 */
window.addEventListener("DOMContentLoaded", () => {

  // キャラクター選択プルダウンを生成する
  initCharacterSelect();

});
