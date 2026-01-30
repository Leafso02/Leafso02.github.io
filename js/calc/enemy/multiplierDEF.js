/**
 * baseDamageEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : multiplierDEF.js
 * ================================
 * 
 * 「ダメージ基礎値」のみを算出する
 *
 * ダメージ基礎値 =
 *   参照ステータス × 軌跡倍率 + ダメージ加算
 */

import { getEnemyState } from "../../ui/enemyStat.js";


export function calculateDEFMultiplier(){
    
}
const enemyState = getEnemyState();