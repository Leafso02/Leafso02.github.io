/**
 * structuredClone.js
 * ================================
 * 上位ファイル : skillModifierEngine.js
 * 下位ファイル : なし
 * ================================
 * ・星魂、追加能力を適用したスキルを仮生成する
 *
 */

export default function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}