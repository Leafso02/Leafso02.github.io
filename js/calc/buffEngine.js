import { checkCondition } from "./conditionEngine.js";
import { getMultiplier } from "./multiplierEngine.js";

/**
 * 現在の状況で有効なバフをすべて集める
 *
 * - スキル固有バフ
 * - 星魂バフ
 * - 軌跡バフ
 *
 * を一括で処理する
 */
export function collectBuffs({
  skillData,
  eidolonsData,
  tracesData,
  multiplierData,
  skillType,
  skillLevel,
  eidolonLevel,
  context
}) {
  const buffs = [];

  /* ==========================
     スキル由来のバフ処理
  ========================== */
  const bases = skillData[skillType]?.base ?? [];

  for (const base of bases) {
    for (const group of base.buffGroups ?? []) {

      // conditionを満たしていなければスキップ
      if (!checkCondition(group.condition, context)) continue;

      // group内のバフを展開
      for (const buff of group.buffs) {
        buffs.push(
          resolveBuff(buff, multiplierData, skillType, skillLevel)
        );
      }
    }
  }

  /* ==========================
     星魂（eidolons）処理
  ========================== */
  for (const e of eidolonsData.eidolons ?? []) {

    // 未解放の星魂は無視
    if (e.level > eidolonLevel) continue;

    for (const op of e.operations ?? []) {
      if (op.op === "addBuffToGroup") {
        for (const buff of op.buffs ?? []) {
          buffs.push(
            resolveBuff(buff, multiplierData, skillType, skillLevel)
          );
        }
      }
    }
  }

  /* ==========================
     追加能力（traces）処理
  ========================== */
  for (const t of tracesData.bonusAbilities ?? []) {
    for (const op of t.operations ?? []) {
      if (op.op === "addBuffToGroup") {
        for (const buff of op.buffs ?? []) {
          buffs.push(
            resolveBuff(buff, multiplierData, skillType, skillLevel)
          );
        }
      }
    }
  }

  return buffs;
}

/**
 * バフのsourceを解決し、数値として確定させる
 */
function resolveBuff(buff, multiplierData, skillType, skillLevel) {
  let value = 0;

  // 固定値バフ
  if (buff.source.type === "fixed") {
    value = buff.source.value;
  }

  // 倍率参照バフ
  if (buff.source.type === "multiplier") {
    value = getMultiplier(
      multiplierData,
      buff.source.table,
      skillLevel,
      buff.source.id
    );
  }

  // 計算済みバフとして返却
  return {
    ...buff,
    resolvedValue: value
  };
}
