import { checkCondition } from "./conditionEngine.js";
/**
 * 計算に使用するすべてのバフを収集する
 */
export function collectAllBuffs(context) {
  console.log("[buffEngine] context dump", structuredClone(context));
  const buffs = [];

  buffs.push(
    ...collectEidolonBuffs(context),
    ...collectTraceBuffs(context),
    ...collectSkillBuffs(context),
    ...collectAllyBuffs(context),
    ...collectLightConeBuffs(context),
    ...collectManualBuffs(context)
  );

  // 条件評価
  return buffs.filter(buff => evaluateCondition(buff.condition, context));
}

/* =====================
 * 各バフ種別ごとの収集
 * ===================== */

function collectEidolonBuffs(context) {
  const result = [];

  Object.values(context.eidolons || {}).forEach(eidolon => {
    if (!eidolon.buffs) return;
    if (eidolon.level > context.eidolonLevel) return;

    eidolon.buffs.forEach(buff => {
      result.push({
        ...buff,
        source: "eidolon"
      });
    });
  });

  return result;
}

function collectTraceBuffs(context) {
  const result = [];

  Object.values(context.traces || {}).forEach(trace => {
    trace.bonusAbility?.forEach(buff => {
      result.push({ ...buff, source: "trace" });
    });

    trace.statusBonus?.forEach(buff => {
      result.push({ ...buff, source: "trace" });
    });
  });

  return result;
}

function collectSkillBuffs(context) {
  const result = [];

  // 
  if (!context.skills) {
    console.warn("[buffEngine] context.skills is undefined", context);
    return result;
  }

  if (!context.skillType) {
    console.warn("[buffEngine] context.skillType is undefined", context);
    return result;
  }

  const skillGroup = context.skills[context.skillType];

  if (!skillGroup?.base) {
    console.warn(
      `[buffEngine] skillGroup.base not found for skillType: ${context.skillType}`,
      skillGroup
    );
    return result;
  }

  skillGroup.base.forEach(skill => {
    skill.buffGroups?.forEach(group => {
      group.buffs?.forEach(buff => {
        result.push({
          ...buff,
          source: "skill",
          skillId: skill.skillId,
        });
      });
    });
  });

  return result;
}


function collectAllyBuffs(context) {
  // 将来実装
  return [];
}

function collectLightConeBuffs(context) {
  // 将来実装
  return [];
}

function collectManualBuffs(context) {
  return context.manualBuffs || [];
}

/* =====================
 * 条件評価エンジン
 * ===================== */

function evaluateCondition(condition, context) {
  if (!condition) return true;

  switch (condition.type) {
    case "always":
      return true;

    case "skillType":
      return context.skillType === condition.value;

    case "eidolonLevel":
      return context.eidolonLevel >= condition.value;

    case "userAct":
      return context.isUserTurn === true;

    default:
      console.warn("未対応の条件:", condition);
      return true;
  }
}
