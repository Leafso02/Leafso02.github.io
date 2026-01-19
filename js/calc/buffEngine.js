import { collectManualBuffs } from "./manualBuffParser.js";
/**
 * buffEngine.js
 *
 * ・星魂・追加能力が適用されたスキル群から
 *   「今このアタッカーに有効なバフ」だけを抽出する
 */

export function collectAllBuffs({
  skills,
  traces,
  eidolons,
  skillType,
  eidolonLevel,
}) {

  const context = {
    skillType,
    eidolonLevel
};

  const buffList = [
    ...collectSkillBuffs(skills, skillType, context),
    ...collectTalentBuffs(skills, context),
    ...collectTraceBuffs(traces, context),
    ...collectEidolonBuffs(eidolons, context),
    ...collectSupporterBuffs(),
    ...collectManualBuffs()
  ];

  console.log(buffList);

  return aggrgateBuffs(buffList);

  // 条件評価
  // return buffs.filter(buff => evaluateCondition(buff.condition, context));
}

/* =====================
 * 各バフ種別ごとの収集
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

/* =====================
 * 軌跡バフの集計
 * ===================== */
function collectTraceBuffs(context) {
  const result = [];

  return result;
}

/* =====================
 * 星魂バフの集計
 * ===================== */
function collectEidolonBuffs(skills, context) {
  const result = [];

  const talentGroup = skills.talent;
  if (!talentGroup?.base) return result;

  talentGroup.base.forEach(talent => {
    // atkOnly の天賦は無視
    if (talent.type === "atkOnly") return;

    talent.buffGroups?.forEach(group => {
      group.buffs?.forEach(buff => {
        if (!isBuffActive(buff.condition, context)) return;

        result.push(normalizeBuff(buff));
      });
    });
  });

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

  console.log(buffList);

  for (const { valueType, valueUnit, value } of buffList) {

    if (!result[valueType]) {
      result[valueType] = { flat: 0, percent: 0 };
    }
    
    // 固定値(flat)のバフは基本ステータスにしかないため、比較は基本ステータスのみに
    const isBaseStat = ["Hp", "Atk", "Def", "Spd"].includes(valueType);

    if (isBaseStat) {
      if (valueUnit === "percent") {
        result[valueType].percent += value;
      } else {
        result[valueType].flat += value;
      }
    } else {
      result[valueType].percent += value;
    }
  }

  console.log(result);
  return result;
}

