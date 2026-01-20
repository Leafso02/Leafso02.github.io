/**
 * manualBuffParser.js
 *
 * UI入力されたバフを
 * buffEngine と同一フォーマットに正規化する
 */


const FLAT_ALLOWED = new Set(["Hp", "Atk", "Def", "Spd"]);

export function collectManualBuffs() {
  const result = [];

  const rows = document.querySelectorAll(".manual-buff");

  rows.forEach(row => {
    const typeElem = row.querySelector(".buff-type");
    const unitElem = row.querySelector(".buff-unit");
    const valueElem = row.querySelector(".buff-value");

    if (!typeElem || !valueElem) return;

    const valueType = typeElem.value;
    const rawValue = valueElem.value;

    if (!valueType || rawValue === "") return;

    let valueUnit = unitElem?.value ?? "percent";
    let numericValue = Number(rawValue);

    if (Number.isNaN(numericValue)) return;

    // 安全装置：flat禁止タイプは強制percent
    if (!FLAT_ALLOWED.has(valueType)) {
      valueUnit = "percent";
    }

    const value =
      valueUnit === "percent"
        ? numericValue / 100
        : numericValue;

    result.push({
      valueType,
      valueUnit,
      value,
    });
  });

  return result;
}
