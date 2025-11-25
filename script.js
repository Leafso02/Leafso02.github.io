function calc() {
  const status = Number(document.getElementById("status").value);
  const skill = Number(document.getElementById("skill").value);
  const add = Number(document.getElementById("add").value);

  const critRate = Number(document.getElementById("critRate").value) / 100;
  const critDmg = Number(document.getElementById("critDmg").value) / 100;

  const dmgBuff = Number(document.getElementById("dmgBuff").value) / 100;

  const enemyLv = Number(document.getElementById("enemyLv").value);
  const defDown = Number(document.getElementById("defDown").value) / 100;

  // ダメージ基礎値
  const base = status * skill + add;

  // 会心係数
  const crit = 1 + (critRate * critDmg);

  // 与ダメージ係数
  const dmg = 1 + dmgBuff;

  // 防御係数（攻撃側Lvは80で仮固定：必要なら変更可）
  const atkLv = 80;
  const def =
    (20 + atkLv) /
    ((20 + enemyLv) * (1 - defDown) + 20 + atkLv);

  const final = base * crit * dmg * def;

  document.getElementById("result").textContent =
    Math.floor(final);
}
