// buffDefinitions.js
// バフオブジェクトの初期化
export const BUFF_DEFINITIONS = [
  { valueType: "Hp", units: ["flatValue", "value"] },
  { valueType: "Atk", units: ["flatValue", "value"] },
  { valueType: "Def", units: ["flatValue", "value"] },
  { valueType: "Spd", units: ["flatValue", "value"] },
  { valueType: "ExtraDMGDmg", units: ["flatValue"] },
  { valueType: "CRITRate", units: ["value"] },
  { valueType: "CRITDMG", units: ["value"] },
  { valueType: "ElementalDMGBoost", units: ["value"] },
  { valueType: "AllDMGBoost", units: ["value"] },
  { valueType: "DefDebuf", units: ["value"] },
  { valueType: "DEFIgnore", units: ["value"] },
  { valueType: "RESPEN", units: ["value"] },
  { valueType: "TypeDmgReceived", units: ["value"] },
  { valueType: "DmgReceived", units: ["value"] },
  { valueType: "AddDmg", units: ["value"] },
  { valueType: "TrueDmg", units: ["value"] },
];
