/**
 * buffEngine.js
 * ================================
 * 上位ファイル : mainCalc.js
 * 下位ファイル : manualBuffParser.js
 * ================================
 * ・星魂・追加能力が適用されたスキル群から
 *   「今このアタッカーに有効なバフ」だけを抽出する
 *
 * 【収集対象】
 * ・アタッカーが今回使用したバフスキル
 * ・アタッカーの天賦バフ（常時・条件付き）
 * ・サポーター由来バフ
 * ・手動入力バフ
 */

import { BUFF_DEFINITIONS } from "./buffDefinitions.js";
import { collectManualBuffs } from "./manualBuffParser.js";

/* =====================
 * バフ総収集エントリ
 * ===================== */
export function collectAllBuffs({
  attackerSkills,     // 星魂適用済みアタッカースキル群
  usedBuffSkills,     // 今回使用したアタッカーのバフスキル
  supporterBuffs,     // サポーター由来バフ
  context
}) {

  const buffList = [
    ...createInitialBuffList(),

    ...collectAttackerUsedSkillBuffs(usedBuffSkills, context),
    ...collectTalentBuffs(attackerSkills, context),
    ...collectSupporterBuffs(supporterBuffs, context),
    ...collectManualBuffs()
  ];

  return aggrgateBuffs(buffList);
}

/* =====================
 * 初期バフ枠生成
 * ===================== */
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

/* =====================
 * アタッカー使用スキル由来バフ
 * ===================== */
function collectAttackerUsedSkillBuffs(usedBuffSkills, context) {
  const result = [];
  if (!usedBuffSkills) return result;

  Object.values(usedBuffSkills).forEach(skill => {
    skill?.buffGroups?.forEach(group => {
      if (!isBuffActive(group.condition, context)) return;

      group.buffs?.forEach(buff => {
        if (!isBuffActive(buff.condition, context)) return;
        result.push(normalizeBuff(buff));
      });
    });
  });

  return result;
}

/* =====================
 * 天賦バフ（常時・条件評価あり）
 * ===================== */
function collectTalentBuffs(attackerSkills, context) {
  const result = [];

  const talentGroup = attackerSkills?.talent;
  if (!talentGroup?.base) return result;

  talentGroup.base.forEach(skill => {
    skill.buffGroups?.forEach(group => {
      if (!isBuffActive(group.condition, context)) return;

      group.buffs?.forEach(buff => {
        if (!isBuffActive(buff.condition, context)) return;
        result.push(normalizeBuff(buff));
      });
    });
  });

  return result;
}

/* =====================
 * サポーター由来バフ
 * ===================== */
function collectSupporterBuffs(supporterBuffs, context) {
  const result = [];
  // if (!Array.isArray(supporterBuffs)) return result;

  // supporterBuffs.forEach(supporter => {
  //   Object.values(supporter.usedSkills ?? {}).forEach(skill => {
  //     skill?.buffGroups?.forEach(group => {
  //       if (!isBuffActive(group.condition, context)) return;

  //       group.buffs?.forEach(buff => {
  //         if (!isBuffActive(buff.condition, context)) return;
  //         result.push(normalizeBuff(buff));
  //       });
  //     });
  //   });
  // });

  return result;
}

/* =====================
 * バフ正規化
 * ===================== */
function normalizeBuff(buff) {
  const value =
    buff.valueUnit === "value"
      ? buff.source.value / 100
      : buff.source.value;

  return {
    valueType: buff.valueType,
    valueUnit: buff.valueUnit,
    value,
  };
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

/* =====================
 * バフ統合
 * ===================== */
function aggrgateBuffs(buffList) {
  const result = {};
  const baseStats = ["HP", "ATK", "DEF", "SPD"];

  for (const { valueType, valueUnit, value } of buffList) {

    if (!result[valueType]) {
      if (baseStats.includes(valueType)) {
        result[valueType] = { value: 0, flatValue: 0 };
      } else {
        result[valueType] = { value: 0 };
      }
    }

    if (baseStats.includes(valueType)) {
      if (valueUnit === "value") {
        result[valueType].value += value;
      } else {
        result[valueType].flatValue += value;
      }
    } else {
      result[valueType].value += value;
    }
  }

  return result;
}
