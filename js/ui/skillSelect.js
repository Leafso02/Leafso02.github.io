/**
 * 攻撃可能スキル一覧を取得し、select要素に反映する
 *
 * ・mainCalc から「計算可能なスキル情報」を受け取る
 * ・UI専用の処理なので、計算ロジックは書かない
 */
export function updateSkillSelect(skills) {

    console.log("[skillSelect] updateSkillSelect called");

  const skillSelect = document.getElementById("skillSelect");
  skillSelect.innerHTML = "";

  const AttackableSkills = getAttackableSkills(skills);

AttackableSkills.forEach(skill => {
  const option = document.createElement("option");
  option.value = skill.skillKey;   // 計算用キー（basicATKなど）
  option.textContent = skill.categoryLabel; // 日本語ラベル
  skillSelect.appendChild(option);
});
}

/**
 * 攻撃に使用可能なスキルだけを skillSelect に反映する
 *
 * ・current.skills の内容を参照
 * ・攻撃不可スキルは除外
 */
/**
 * 現在ロードされているキャラの
 * 「攻撃に使用できるスキル一覧」を生成して返す
 *
 * ・UI側はこの戻り値をそのまま select に反映する
 */
export function getAttackableSkills(skills) {

  const result = [];

  Object.entries(skills).forEach(([skillKey, data]) => {

    if (!data.base) return;

    data.base.forEach(skill => {

 if (skill.type === "atkOnly" || skill.type === "both") {
        result.push({
          skillKey,                 // 例: "basicATK"
          categoryLabel: data.skillLabel || "その他", // JSON の skillLabel をカテゴリとして使用
          skillName: skill.name
        });
      }
    });
  });

  return result;
}