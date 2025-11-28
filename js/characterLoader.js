// characters.json を読み込んでプルダウンへ追加
async function loadCharacters() {
    const res = await fetch('./data/characters.json');
    const data = await res.json();

    const select = document.getElementById('characterSelect');
    data.characters.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    // 選択したキャラ表示
    select.addEventListener('change', () => {
        const charData = data.characters.find(x => x.id === select.value);
        updateCharacterPreview(charData);
    });
}

function updateCharacterPreview(charData) {
    if (!charData) {
        document.getElementById('charPreview').style.display = "none";
        return;
    }

    document.getElementById('charImg').src = charData.image;
    document.getElementById('charInfo').innerHTML = `
        <strong>${charData.name}</strong><br>
        属性：<img src="${charData.elementImage}" style="width:24px;">
    `;
    document.getElementById('charPreview').style.display = "block";
}

