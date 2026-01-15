export function buildContext({
  skillType,
  skills,
  traces = {},
  eidolons = {},
  eidolonLevel = 0,
  manualBuffs = [],
  isUserTurn = true,
}) {
  return {
    skillType,
    skills,
    traces,
    eidolons,
    eidolonLevel,
    manualBuffs,
    isUserTurn,
  };
}
