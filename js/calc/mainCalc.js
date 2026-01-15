console.log("[mainCalc] loaded");
import { loadJSON } from "./loadData.js";
import { calculateBaseDamage } from "./baseDamageEngine.js";
import { calculateFinalStats } from "./statEngine.js";


/* ===== HTML要素取得 =====
 * ・計算に必要な入力値のみ取得
 * ・キャラ選択UIはここでは制御しない
 */
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const eidolonLevelInput = document.getElementById("eidolonLevel");
const resultElem = document.getElementById("damageResult");

/* ===== 現在ロード中のキャラデータ =====
 * ・characterSelect 側から指定されたキャラIDを元に構築される
 */
let current = {};

/**
 * キャラIDを受け取り、計算に必要な全JSONを読み込む
 *
 * ・characterId：選択されたキャラのID
 * ・読み込んだデータは current に集約する
 */
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
}

/**
 * 攻撃に使用可能なスキルだけを skillSelect に反映する
 *
 * ・current.skills の内容を参照
 * ・攻撃不可スキルは除外
 */
/**
 * 現在ロードされているキャラの
 * 「攻撃に使用できるスキル一覧」を生成して返す
 *
 * ・UI側はこの戻り値をそのまま select に反映する
 */
export function getAttackableSkills() {
  const result = [];

  Object.entries(current.skills).forEach(([skillKey, data]) => {

    if (!data.base) return;

    data.base.forEach(skill => {

 if (skill.type === "atkOnly" || skill.type === "both") {
        result.push({
          skillKey,                 // 例: "basicATK"
          categoryLabel: data.skillLabel || "その他", // JSON の skillLabel をカテゴリとして使用
          skillName: skill.name
        });
      }
    });
  });

  return result;
}

/**
 * メインのダメージ計算処理
 */

export function calculateDamage({
  skillData,
  multiplierData,
  characterData,
  skillKey,
  skillLevel
}) {

  /**
   * ============================
   * 1. 最終ステータス算出
   * ============================
   */

  const finalStats = calculateFinalStats(characterData);

  /**
   * ============================
   * 2. ダメージ基礎値
   * ============================
   */

  const baseResult = calculateBaseDamage({
    skillData,
    multiplierData,
    finalStats,
    skillKey,
    skillLevel
  });

  const baseDamage = baseResult.baseDamage;

  /**
   * ============================
   * 3. 会心係数
   * ============================
   */

  const critRate = finalStats.CritRate ?? 0;
  const critDmg = finalStats.CritDmg ?? 0;

  const critMultiplier = 1 + (critRate * critDmg);

  /**
   * ============================
   * 4. ダメージ（敵係数なし）
   * ============================
   */

  const totalDamage = baseDamage * critMultiplier;

  return {
    baseDamage,
    critRate,
    critDmg,
    critMultiplier,
    totalDamage
  };
}