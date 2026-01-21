// buffDefinitions.js
// バフオブジェクトの初期化
export const BUFF_DEFINITIONS = [
  { valueType: "Hp", units: ["flat", "percent"] },
  { valueType: "Atk", units: ["flat", "percent"] },
  { valueType: "Def", units: ["flat", "percent"] },
  { valueType: "Spd", units: ["flat", "percent"] },
  { valueType: "ExtraDMGDmg", units: ["flat"] },
  { valueType: "CRITRate", units: ["percent"] },
  { valueType: "CRITDMG", units: ["percent"] },
  { valueType: "ElementalDMGBoost", units: ["percent"] },
  { valueType: "AllDMGBoost", units: ["percent"] },
  { valueType: "DefDebuf", units: ["percent"] },
  { valueType: "DEFIgnore", units: ["percent"] },
  { valueType: "RESPEN", units: ["percent"] },
  { valueType: "TypeDmgReceived", units: ["percent"] },
  { valueType: "DmgReceived", units: ["percent"] },
  { valueType: "AddDmg", units: ["percent"] },
  { valueType: "TrueDmg", units: ["percent"] },
];
