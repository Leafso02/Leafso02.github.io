// ===== 敵属性（複数対応）=====
const selectedElements = new Set();

document.querySelectorAll(".element-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const element = btn.dataset.element;

    if (selectedElements.has(element)) {
      selectedElements.delete(element);
      btn.classList.remove("active");
    } else {
      selectedElements.add(element);
      btn.classList.add("active");
    }
  });
});


// ===== 敵Lv制御 =====
let enemyLevel = 90;
const enemyLevelValue = document.getElementById("enemyLevelValue");

function updateEnemyLevelDisplay() {
  enemyLevelValue.textContent = enemyLevel;
}

document.getElementById("enemyLvUp").addEventListener("click", () => {
  if (enemyLevel < 100) {
    enemyLevel++;
    updateEnemyLevelDisplay();
  }
});

document.getElementById("enemyLvDown").addEventListener("click", () => {
  if (enemyLevel > 1) {
    enemyLevel--;
    updateEnemyLevelDisplay();
  }
});

updateEnemyLevelDisplay();


// ===== 高難易度反映ボタン（仮）=====
document.getElementById("syncHighDifficultyBtn")
  .addEventListener("click", () => {
    console.log("高難易度反映（未実装）");
  });


  // ===== 敵情報取得 =====
export function getEnemyState() {
  return {
    level: enemyLevel,
    weaknessElements: Array.from(selectedElements)
  };
}

