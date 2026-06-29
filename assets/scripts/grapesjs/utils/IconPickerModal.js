export const openIconPickerModal = (editor, icons, currentIcon, onIconSelected) => {
    const wrapper = document.createElement("div");
    wrapper.className = "pb-icon-picker";

    const search = document.createElement("input");
    search.type = "text";
    search.placeholder = "Rechercher une icône…";
    search.className = "pb-icon-picker__search";
    wrapper.appendChild(search);

    const grid = document.createElement("div");
    grid.className = "pb-icon-picker__grid";
    wrapper.appendChild(grid);

    const buildGrid = (filter = "") => {
        grid.innerHTML = "";
        Object.keys(icons)
            .filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((name) => {
                const { svg } = icons[name];
                const item = document.createElement("button");
                item.type = "button";
                item.title = name;
                item.className = "pb-icon-picker__item";
                if (name === currentIcon) {
                    item.classList.add("pb-icon-picker__item--active");
                }
                item.innerHTML = `<span class="pb-icon-picker__glyph">${svg}</span><span class="pb-icon-picker__label">${name}</span>`;
                item.addEventListener("click", () => {
                    onIconSelected?.(name);
                    editor.Modal.close();
                });
                grid.appendChild(item);
            });
    };

    buildGrid();
    search.addEventListener("input", () => buildGrid(search.value));

    editor.Modal.open({ title: "Choisir une icône", content: wrapper });
    setTimeout(() => search.focus(), 50);
};
