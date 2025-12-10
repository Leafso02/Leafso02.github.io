const CHARACTER_IMAGE_BASE_PATH = "img/characters/";

export async function loadCharacters() {
    const response = await fetch("./data/characters.json");
    const data = await response.json();

    const listArea = document.getElementById("characterList");

    data.list.forEach(char => {
        const div = document.createElement("div");
        div.classList.add("character-icon");
        div.dataset.id = char.id;

        const img = document.createElement("img");
        img.src = CHARACTER_IMAGE_BASE_PATH + char.img;

        div.appendChild(img);
        listArea.appendChild(div);

        // クリック選択
        div.addEventListener("click", () => {
            document
                .querySelectorAll(".character-icon")
                .forEach(el => el.classList.remove("selected"));

            div.classList.add("selected");

            showCharacterPreview(char);
        });
    });
}

function showCharacterPreview(char) {
    const preview = document.getElementById("charPreview");
    const img = document.getElementById("charImg");
    const info = document.getElementById("charInfo");

    img.src = CHARACTER_IMAGE_BASE_PATH + char.img;
    info.textContent = `${char.name} / ${char.element}`;
    preview.style.display = "block";

    // 選択中キャラをグローバルに保持
    window.selectedCharacterId = char.id;
}
