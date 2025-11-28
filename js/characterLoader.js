// js/characterLoader.js
export async function loadCharacters() {
    const response = await fetch('./data/characters.json');
    const data = await response.json();

    const select = document.getElementById('characterSelect');

    // プルダウンへ追加
    data.characters.forEach(char => {
        const option = document.createElement('option');
        option.value = char.id;
        option.textContent = char.name;
        select.appendChild(option);
    });

    // 選択時のプレビュー処理
    select.addEventListener('change', () => {
        const charId = select.value;
        const charData = data.characters.find(c => c.id === charId);

        const preview = document.getElementById('charPreview');
        const img = document.getElementById('charImg');
        const info = document.getElementById('charInfo');

        if (!charData) {
            preview.style.display = "none";
            return;
        }

        img.src = charData.image;

        info.innerHTML = `
            <strong>${charData.name}</strong><br>
            属性：<img src="${charData.elementImage}" style="width:24px; vertical-align:middle;">
        `;

        preview.style.display = "block";
    });
}
