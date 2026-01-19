/**
 * manualBuffParser.js
 *
 * UI入力されたバフを
 * buffEngine と同一フォーマットに正規化する
 */

export function collectManualBuffsFromUI() {
  const result = [];

  const rows = document.querySelectorAll(".manual-buff");

  rows.forEach(row => {
    const valueType = row.querySelector(".buff-type")?.value;
    const valueUnit = row.querySelector(".buff-unit")?.value;
    const rawValue = row.querySelector(".buff-value")?.value;

    if (!valueType || rawValue === "") return;

    const value =
      valueUnit === "percent"
        ? Number(rawValue) / 100
        : Number(rawValue);

    result.push({
      valueType,
      valueUnit,
      value,
    });
  });

  return result;
}
