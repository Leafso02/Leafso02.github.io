console.log("[mainCalc] loaded");
import { loadJSON } from "./loadData.js";
import { collectBuffs } from "./buffEngine.js";
import { applyBuffsToStats } from "./statEngine.js";
import { calculateDamage } from "./damageEngine.js";

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

  console.log("[mainCalc] current.skills =", current.skills);

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
 * ダメージ計算処理
 *
 * ・UI入力値を収集
 * ・バフを集計
 * ・最終ステータスを算出
 * ・ダメージを計算し画面に表示
 */
document.getElementById("calcBtn").addEventListener("click", () => {

  const skillType = skillSelect.value;
  const skillLevel = Number(skillLevelInput.value);
  const eidolonLevel = Number(eidolonLevelInput.value);

  // 各種データを buffEngine に送る
  const buffs = collectBuffs({
    skillData: current.skills,
    eidolonsData: current.eidolons,
    tracesData: current.traces,
    multiplierData: current.multipliers,
    skillType,
    skillLevel,
    eidolonLevel,
    context: { attackType: skillType }
  });

  // キャラ基礎ステータスを定義
  const baseStats = {
    atk: current.character.baseAtk,
    critDmg: 0,
    resPen: 0
  };

  // バフを基礎ステータスに反映
  const finalStats = applyBuffsToStats(baseStats, buffs);

  // ダメージ計算
  const dmg = calculateDamage({
    attackerStats: finalStats,
    multiplierData: current.multipliers,
    skillType,
    skillLevel
  });

  resultElem.textContent = `ダメージ：${Math.floor(dmg)}`;
});
