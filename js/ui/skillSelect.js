import { getAttackableSkills } from "../calc/mainCalc.js";

/**
 * 攻撃可能スキル一覧を取得し、select要素に反映する
 *
 * ・mainCalc から「計算可能なスキル情報」を受け取る
 * ・UI専用の処理なので、計算ロジックは書かない
 */
export function updateSkillSelect() {

  const skillSelect = document.getElementById("skillSelect");
  skillSelect.innerHTML = "";

  const skills = getAttackableSkills();

  skills.forEach(skill => {
    const option = document.createElement("option");
    option.value = skill.skillType; // 例: "ultimate"
    option.textContent = skill.name;
    skillSelect.appendChild(option);
  });
}
