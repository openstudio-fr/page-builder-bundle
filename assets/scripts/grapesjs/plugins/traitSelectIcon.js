import { openIconPickerModal } from "../utils/index.js";

/**
 * Trait type "select-icon": opens the icon picker and stores the chosen icon name.
 * options.icons: list of { name, svg }.
 */
export default (editor, options = {}) => {
    const iconsList = Array.isArray(options.icons) ? options.icons : [];
    const icons = iconsList.reduce((map, icon) => {
        map[icon.name] = icon;
        return map;
    }, {});

    const tm = editor.TraitManager;

    tm.addType("select-icon", {
        templateInput: "",
        createInput({ trait }) {
            const component = trait.target;
            const traitName = trait.get("name");

            const el = document.createElement("div");
            el.className = "pb-trait-icon";

            const iconPreview = document.createElement("div");
            iconPreview.className = "pb-trait-icon__preview";
            el.appendChild(iconPreview);

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Choisir";
            button.classList.add("gjs-clm-tags-btn");
            button.style.flexGrow = "1";
            el.appendChild(button);

            const required = trait.get("required") || false;
            if (!required) {
                const clearButton = document.createElement("button");
                clearButton.type = "button";
                clearButton.textContent = "✕";
                clearButton.title = "Effacer";
                clearButton.classList.add("gjs-clm-tags-btn");
                el.appendChild(clearButton);

                clearButton.addEventListener("click", () => {
                    iconPreview.innerHTML = "...";
                    if (trait.get("changeProp")) {
                        component.set(traitName, null);
                    } else {
                        component.addAttributes({ [traitName]: null });
                    }
                });
            }

            button.addEventListener("click", () => {
                const currentValue = (trait.get("changeProp") ? component.get(traitName) : component.getAttributes()[traitName]) || null;
                openIconPickerModal(editor, icons, currentValue, (name) => {
                    iconPreview.innerHTML = icons[name]?.svg || "";
                    if (trait.get("changeProp")) {
                        component.set(traitName, name);
                    } else {
                        component.addAttributes({ [traitName]: name });
                    }
                });
            });

            return el;
        },

        onUpdate({ elInput, component, trait }) {
            const name = trait.get("name");
            const changeProp = trait.get("changeProp");
            const [preview] = elInput.children;
            const iconValue = (changeProp ? component.get(name) : component.getAttributes()[name]) || "";
            preview.innerHTML = icons[iconValue]?.svg || "...";
        },
    });
};
