/* =====================
 * バフ定義
 * ===================== */

const BUFF_TYPES = [
  "Hp",
  "Atk",
  "Def",
  "Spd",
  "CritRate",
  "CritDmg",
  "IncreaseTypeDmg",
  "IncreaseDmg",
  "AddMultiplierDmg",
  "DefDebuf",
  "DefIgnore",
  "ResPen",
  "TypeDmgReceived",
  "DmgReceived",
  "AddDmg",
  "TrueDmg"
];

const FLAT_ALLOWED = new Set(["Hp", "Atk", "Def", "Spd"]);

/* =====================
 * 行生成
 * ===================== */

function createBuffRow(index) {
  const row = document.createElement("div");
  row.className = "manual-buff";
  row.dataset.index = index;

  /* --- buff type --- */
  const typeSelect = document.createElement("select");
  typeSelect.className = "buff-type";

  typeSelect.innerHTML = `
    <option value="">なし</option>
    ${BUFF_TYPES.map(t => `<option value="${t}">${t}</option>`).join("")}
  `;

  /* --- buff unit --- */
  const unitSelect = document.createElement("select");
  unitSelect.className = "buff-unit";
  unitSelect.innerHTML = `
    <option value="percent">%</option>
    <option value="flat">固定値</option>
  `;
  unitSelect.disabled = true;

  /* --- value --- */
  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.className = "buff-value";
  valueInput.placeholder = "数値";

  /* =====================
   * type 選択時の挙動
   * ===================== */
  typeSelect.addEventListener("change", () => {
    const type = typeSelect.value;
    if (!type) return;

    // unit制御
    if (FLAT_ALLOWED.has(type)) {
      unitSelect.disabled = false;
    } else {
      unitSelect.disabled = true;
      unitSelect.value = "percent";
    }

    addNextRowIfNeeded(index);
  });

  row.append(typeSelect, unitSelect, valueInput);
  return row;
}

/* =====================
 * 次の行を追加
 * ===================== */

function addNextRowIfNeeded(index) {
  const nextIndex = index + 1;

  if (document.querySelector(`[data-index="${nextIndex}"]`)) {
    return;
  }

  const container = document.getElementById("manual-buff-container");
  container.appendChild(createBuffRow(nextIndex));
}

/* =====================
 * 初期化
 * ===================== */

export function initManualBuffUI() {
  const container = document.getElementById("manual-buff-container");
  container.innerHTML = "";
  container.appendChild(createBuffRow(0));
}
