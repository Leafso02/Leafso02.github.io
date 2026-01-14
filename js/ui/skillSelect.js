import { getAttackableSkills } from "../calc/mainCalc.js";

/**
 * 攻撃可能スキル一覧を取得し、select要素に反映する
 *
 * ・mainCalc から「計算可能なスキル情報」を受け取る
 * ・UI専用の処理なので、計算ロジックは書かない
 */
export function updateSkillSelect() {

    console.log("[skillSelect] updateSkillSelect called");

  const skillSelect = document.getElementById("skillSelect");
  skillSelect.innerHTML = "";

  const skills = getAttackableSkills();

skills.forEach(skill => {
  const option = document.createElement("option");
  option.value = skill.skillKey;   // 計算用キー（basicATKなど）
  option.textContent = skill.data.categoryLabel; // 日本語ラベル
  skillSelect.appendChild(option);
});
}