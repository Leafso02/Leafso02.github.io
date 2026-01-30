// ===== 敵属性選択 =====
let selectedElement = null;

document.querySelectorAll(".element-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".element-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedElement = btn.dataset.element;
  });
});

// ===== 敵Lv制御 =====
let enemyLevel = 90;
const enemyLevelValue = document.getElementById("enemyLevelValue");

document.getElementById("enemyLvUp").addEventListener("click", () => {
  if (enemyLevel < 100) {
    enemyLevel++;
    enemyLevelValue.textContent = enemyLevel;
  }
});

document.getElementById("enemyLvDown").addEventListener("click", () => {
  if (enemyLevel > 1) {
    enemyLevel--;
    enemyLevelValue.textContent = enemyLevel;
  }
});

// ===== 高難易度反映ボタン（仮）=====
document.getElementById("syncHighDifficultyBtn")
  .addEventListener("click", () => {
    console.log("高難易度反映（未実装）");
  });
