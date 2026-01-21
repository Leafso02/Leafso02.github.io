// buffDefinitions.js
// バフオブジェクトの初期化
export const BUFF_DEFINITIONS = [
  { valueType: "Hp", units: ["flat", "percent"] },
  { valueType: "Atk", units: ["flat", "percent"] },
  { valueType: "Def", units: ["flat", "percent"] },
  { valueType: "Spd", units: ["flat", "percent"] },
  { valueType: "AddMultiplierDmg", units: ["flat"] },
  { valueType: "CritRate", units: ["percent"] },
  { valueType: "CritDmg", units: ["percent"] },
  { valueType: "IncreaseTypeDmg", units: ["percent"] },
  { valueType: "IncreaseDmg", units: ["percent"] },
  { valueType: "DefDebuf", units: ["percent"] },
  { valueType: "DefIgnore", units: ["percent"] },
  { valueType: "ResPen", units: ["percent"] },
  { valueType: "TypeDmgReceived", units: ["percent"] },
  { valueType: "DmgReceived", units: ["percent"] },
  { valueType: "AddDmg", units: ["percent"] },
  { valueType: "TrueDmg", units: ["percent"] },
];
