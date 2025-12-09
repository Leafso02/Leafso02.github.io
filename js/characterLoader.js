const CHARACTER_IMAGE_BASE_PATH = "img/character/";

export async function loadCharacters() {
    const response = await fetch("./data/characters.json");
    const data = await response.json();

    const select = document.getElementById("characterSelect");

    // プルダウン生成
    data.list.forEach(char => {
        const option = document.createElement("option");
        option.value = char.id;
        option.textContent = char.name;
        select.appendChild(option);
    });

    // 選択時の表示処理
    select.addEventListener("change", () => {
        const selectedId = select.value;
        const character = data.list.find(c => c.id == selectedId);

        const preview = document.getElementById("charPreview");
        const img = document.getElementById("charImg");
        const info = document.getElementById("charInfo");

        if (!character) {
            preview.style.display = "none";
            return;
        }

        img.src = CHARACTER_IMAGE_BASE_PATH + character.image;
        info.textContent = character.name;

        preview.style.display = "block";
    });
}
