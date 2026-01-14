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

    // カテゴリごとにスキルをグループ化する
  const grouped = {}; // { "通常攻撃": [...], "戦闘スキル": [...] }

  skills.forEach(skill => {
    const label = skill.categoryLabel || "その他"; // カテゴリラベルを取得
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(skill);
  });

// グループごとに optgroup を生成
  Object.entries(grouped).forEach(([categoryLabel, skillArray]) => {

    // optgroup要素を作成し、カテゴリラベルを設定
    const optgroup = document.createElement("optgroup");
    optgroup.label = categoryLabel;

    // 各スキルを option として optgroup に追加
    skillArray.forEach(skill => {
      const option = document.createElement("option");
      option.value = skill.skillKey; // 後続の計算で参照するID
      option.textContent = skill.skillName; // スキル名を表示
      optgroup.appendChild(option);
    });

    // 完成した optgroup を select に追加
    skillSelect.appendChild(optgroup);
  });
}