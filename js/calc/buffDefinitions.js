// buffDEFinitions.js
// バフオブジェクトの初期化
export const BUFF_DEFINITIONS = [
  { valueType: "HP", units: ["flatValue", "value"] },
  { valueType: "ATK", units: ["flatValue", "value"] },
  { valueType: "DEF", units: ["flatValue", "value"] },
  { valueType: "SPD", units: ["flatValue", "value"] },
  { valueType: "ExtraDMGDmg", units: ["flatValue"] },
  { valueType: "CRITRate", units: ["value"] },
  { valueType: "CRITDMG", units: ["value"] },
  { valueType: "ElementalDMGBoost", units: ["value"] },
  { valueType: "AllDMGBoost", units: ["value"] },
  { valueType: "DEFDebuf", units: ["value"] },
  { valueType: "DEFIgnore", units: ["value"] },
  { valueType: "RESPEN", units: ["value"] },
  { valueType: "TypeDmgReceived", units: ["value"] },
  { valueType: "DmgReceived", units: ["value"] },
  { valueType: "AddDmg", units: ["value"] },
  { valueType: "TrueDmg", units: ["value"] },
];
