/**
 * buffEngine.js
 *
 * ・星魂・追加能力が適用されたスキル群から
 *   「今このアタッカーに有効なバフ」だけを抽出する
 */

export function collectAllBuffs({
  attackerSkills,
  attackerTraces,
  attackerEidolon,
  usedSkillType,
  eldolonLevel,
  isUserTurn
  // manualBuffs = [],
}) {

  console.log("attackerSkills : " + attackerSkills);
  console.log("attackerTraces : " + attackerTraces);
  console.log("attackerEidolon : " + attackerEidolon);
  console.log("usedSkillType : " + usedSkillType);
  console.log("eldolonLevel : " + eldolonLevel)

  const buffs = [];

  // 1. 使用スキル由来バフ
  buffs.push(
    ...collectSkillBuffs(attackerSkills, usedSkillType, {
      eidolonLevel,
      isUserTurn,
    })
  );

  // 2. 天賦（常時）
  buffs.push(
    ...collectTalentBuffs(attackerSkills, {
      eidolonLevel,
      isUserTurn,
    })
  );

  // 3. 手動バフ
  buffs.push(...normalizeBuffs(manualBuffs));

  // 4. サポーター由来バフ（入れ物）
  buffs.push(
    ...collectSupporterBuffs()
  );

  return buffs;

  // 条件評価
  // return buffs.filter(buff => evaluateCondition(buff.condition, context));
}

/* =====================
 * 各バフ種別ごとの収集
 * ===================== */

// 使用スキル由来のバフを集計
function collectSkillBuffs(skills, skillType, context) {
  const result = [];

  console.log("skills:" + skills + "skillType:" + skillType + "contect:" + context)

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


function collectTalentBuffs(skills, context) {
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

function normalizeBuffs(buffs = []) {
  return buffs.map(normalizeBuff);
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
