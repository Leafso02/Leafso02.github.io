/* =====================
 * バフ定義
 * ===================== */

const BUFF_TYPE = [
  { value: "Hp", label: "HP" },
  { value: "Atk", label: "攻撃力" },
  { value: "Def", label: "防御力" },
  { value: "Spd", label: "速度" },
  { value: "CRITRate", label: "会心率" },
  { value: "CRITDMG", label: "会心ダメージ" },
  { value: "AllDMGBoost", label: "与ダメージ" },
  { value: "DefDebuf", label: "防御デバフ" },
  { value: "DEFIgnore", label: "防御貫通" },
  { value: "RESPEN", label: "属性耐性貫通" },
  { value: "DmgReceived", label: "敵の被ダメージ増加" },
  { value: "TrueDmg", label: "確定ダメージ" },
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

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "なし";
  typeSelect.appendChild(noneOption);

  BUFF_TYPE.forEach(buff => {
    const option = document.createElement("option");
    option.value = buff.value;
    option.textContent = buff.label;
    typeSelect.appendChild(option);
  });

  /* --- buff unit --- */
  const unitSelect = document.createElement("select");
  unitSelect.className = "buff-unit";
  unitSelect.innerHTML = `
    <option value="value">%</option>
    <option value="flatValue">固定値</option>
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

    // ---- unit制御 ----
    if (FLAT_ALLOWED.has(type)) {
      unitSelect.disabled = false;
    } else {
      unitSelect.disabled = true;
      unitSelect.value = "value";
    }

    cleanupEmptyRows();
    addNextRowIfNeeded();
  });

  row.append(typeSelect, unitSelect, valueInput);
  return row;
}

/* =====================
 * 空行整理（「なし」が2つ以上あれば削除）
 * ===================== */

function cleanupEmptyRows() {
  const rows = Array.from(document.querySelectorAll(".manual-buff"));

  const emptyRows = rows.filter(row => {
    const type = row.querySelector(".buff-type")?.value;
    return type === "";
  });

  while (emptyRows.length > 1) {
    const rowToRemove = emptyRows.shift();
    rowToRemove.remove();
  }
}

/* =====================
 * 次の行を追加
 * ===================== */

function addNextRowIfNeeded() {
  const rows = document.querySelectorAll(".manual-buff");
  const lastRow = rows[rows.length - 1];
  const lastType = lastRow.querySelector(".buff-type")?.value;

  if (lastType !== "") {
    const container = document.getElementById("manual-buff-container");
    container.appendChild(createBuffRow(rows.length));
  }
}

/* =====================
 * 初期化
 * ===================== */

export function initManualBuffUI() {
  const container = document.getElementById("manual-buff-container");
  if (!container) return;

  container.innerHTML = "";
  container.appendChild(createBuffRow(0));
}
