// buffDEFinitions.js
// バフオブジェクトの初期化
export const BUFF_DEFINITIONS = [
  { valueType: "HP", units: ["flatValue", "value"] },
  { valueType: "ATK", units: ["flatValue", "value"] },
  { valueType: "DEF", units: ["flatValue", "value"] },
  { valueType: "SPD", units: ["flatValue", "value"] },
  { valueType: "ExtraDMG", units: ["flatValue"] },
  { valueType: "CRITRate", units: ["value"] },
  { valueType: "CRITDMG", units: ["value"] },
  { valueType: "ElementalDMGBoost", units: ["value"] },
  { valueType: "AllDMGBoost", units: ["value"] },
  { valueType: "DEFReduction", units: ["value"] },
  { valueType: "DEFIgnore", units: ["value"] },
  { valueType: "RESPEN", units: ["value"] },
  { valueType: "ElementalVulnerability", units: ["value"] },
  { valueType: "AllTypeVulnerability", units: ["value"] },
  { valueType: "AddDmg", units: ["value"] },
  { valueType: "TrueDmg", units: ["value"] },
];
