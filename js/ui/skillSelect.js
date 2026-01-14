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

  console.log("[skillSelect] attackable skills:", skills);

  skills.forEach(skill => {
  // カテゴリが変わったら optgroup を生成
    if (currentGroupLabel !== skill.categoryLabel) {
      currentGroupLabel = skill.categoryLabel;
      currentOptGroup = document.createElement("optgroup");
      currentOptGroup.label = currentGroupLabel;
      skillSelect.appendChild(currentOptGroup);
    }

    const option = document.createElement("option");
    option.value = skill.skillKey; // JSONのキー
    option.textContent = skill.skillName; // スキル名

    currentOptGroup.appendChild(option);
  });
}
