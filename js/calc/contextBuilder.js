export function buildContext({
  skills,
  traces,
  eidolons,
  skillType,
  eidolonLevel,
  manualBuffs,
}) {
  return {
    skillType,
    eidolonLevel,
    manualBuffs,

    // ★ ここが重要
    skills,
    traces: traces.bonusAbilities ?? [],
    eidolons: eidolons.eidolons ?? []
  };
}
