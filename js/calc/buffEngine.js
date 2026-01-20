/**
 * buffEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : manualBuffParser.js
 * ================================
 * ・星魂・追加能力が適用されたスキル群から
 *   「今このアタッカーに有効なバフ」だけを抽出する
 */

import { BUFF_DEFINITIONS } from "./buffDefinitions.js";
import { collectManualBuffs } from "./manualBuffParser.js";


export function collectAllBuffs({
  skills,
  skillType,
}) {

  const context = {
    skillType,
    eidolonLevel
};

  const buffList = [
    ...createInitialBuffList(),

    ...collectSkillBuffs(skills, skillType, context),
    ...collectTalentBuffs(skills, context),
    ...collectSupporterBuffs(),
    ...collectManualBuffs()
  ];

  return aggrgateBuffs(buffList);

  // 条件評価
  // return buffs.filter(buff => evaluateCondition(buff.condition, context));
}

// バフの初期化
function createInitialBuffList() {
  const list = [];

  for (const def of BUFF_DEFINITIONS) {
    for (const unit of def.units) {
      list.push({
        valueType: def.valueType,
        valueUnit: unit,
        value: 0
      });
    }
  }

  return list;
}

/*  =====================
 * 各バフ種別ごとの収集
 * 軌跡(追加能力)と星魂はバフではスキルロジックに追加する形
 * ===================== */

/* =====================
 * 使用スキル由来のバフの集計
 * ===================== */
function collectSkillBuffs(skills, skillType, context) {
  const result = [];

  const skillGroup = skills[skillType];
  if (!skillGroup?.base) return result;

  skillGroup.base.forEach(skill => {
    skill.buffGroups?.forEach(group => {
      group.buffs?.forEach(buff => {
        if (!isBuffActive(buff.condition, context)) return;

        result.push(normalizeBuff(buff));
      });
    });
  });

  return result;
}

/* =====================
 * 天賦バフの集計
 * ===================== */
function collectTalentBuffs(context) {
  const result = [];

  return result;
}


// 正規化を行うのはここだけ
function normalizeBuff(buff) {
  const value =
    buff.valueUnit === "percent"
      ? buff.source.value / 100
      : buff.source.value;

  return {
    valueType: buff.valueType,
    valueUnit: buff.valueUnit,
    value,
  };
}


function collectSupporterBuffs() {
  // 将来:
  // supporterSkills / supporterStates を受け取って処理
  return [];
}

function collectLightConeBuffs(context) {
  // 将来実装
  return [];
}

/* =====================
 * 条件評価エンジン
 * ===================== */

function isBuffActive(condition, context) {
  if (!condition) return true;

  switch (condition.type) {
    case "always":
      return true;

    case "skillType":
      return context.skillType === condition.value;

    case "eidolonLevel":
      return context.eidolonLevel >= condition.value;

    case "userAct":
      return true;

    default:
      console.warn("未対応の条件:", condition);
      return true;
  }
}

// 全てのバフを統合
// 例) {Atk{}, crtRate{}}
function aggrgateBuffs(buffList) {
  const result = {};
  const baseStats = ["Hp", "Atk", "Def", "Spd"];

  for (const { valueType, valueUnit, value } of buffList) {

    // 初期化
    // 基本ステータスのみvalueとflatValueの生成
    if (!result[valueType]) {
      if (baseStats.includes(valueType)) {
        result[valueType] = { value: 0, flatValue: 0 };
      } else {
        result[valueType] = { value: 0 };
      }
    }

    // 基本ステータス
    if (baseStats.includes(valueType)) {
      if (valueUnit === "percent") {
        result[valueType].value += value;
      } else {
        result[valueType].flatValue += value;
      }
    }
    // 非基本ステータス
    else {
      result[valueType].value += value;
    }
  }

  return result;
}

