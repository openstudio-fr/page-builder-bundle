import { isComponentOfType, injectComponentType, openIconPickerModal } from "../utils/index.js";
import { getIcon, listIcons } from "../icons.js";

const DEFAULT_ICONS = listIcons()
    .filter((name) => name.startsWith("generic:"))
    .map((name) => ({ name: name.replace("generic:", ""), svg: getIcon(name) }));

const ICON_TYPE = "icon";
const ICON_PROP = "data-icon";

export default (editor, options = {}) => {
    const icons = (Array.isArray(options.icons) && options.icons.length > 0 ? options.icons : DEFAULT_ICONS).reduce((map, icon) => {
        map[icon.name] = icon;
        return map;
    }, {});
    const iconsNames = Object.keys(icons);
    const defaultIcon = options.defaultIcon ?? iconsNames[0];

    const openIconPicker = (model) => {
        openIconPickerModal(editor, icons, model.get(ICON_PROP), (name) => model.set(ICON_PROP, name));
    };

    editor.TraitManager.addType("icon-picker", {
        createInput({ trait }) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = "Modifier l'icône…";
            btn.className = "pb-trait-button";
            btn.addEventListener("click", () => openIconPicker(trait.target));
            return btn;
        },
    });

    editor.DomComponents.addType(ICON_TYPE, {
        isComponent: isComponentOfType(ICON_TYPE),
        model: {
            defaults: {
                [ICON_PROP]: defaultIcon,
                content: icons[defaultIcon].svg,
                attributes: injectComponentType(ICON_TYPE),
                traits: [{ type: "icon-picker", label: "Icône", name: ICON_PROP }],
                resizable: { keepAutoHeight: true, tl: false, tc: false, tr: false, cl: false, cr: false, bl: false, bc: false },
                style: { width: "32px", height: "auto" },
            },
            init() {
                this.on(`change:${ICON_PROP}`, (_, value) => this.set("content", icons[value]?.svg || "?"));
            },
        },
        view: {
            events: { dblclick: "onDblClick" },
            onDblClick(e) {
                e.preventDefault();
                e.stopPropagation();
                openIconPicker(this.model);
            },
        },
    });

    editor.BlockManager.add(ICON_TYPE, {
        label: "Icon",
        category: "Basic",
        select: true,
        media: getIcon("block:icon"),
        content: { type: ICON_TYPE },
    });

    editor.I18n.addMessages({
        fr: {
            blockManager: { labels: { [ICON_TYPE]: "Icône" } },
            domComponents: { names: { [ICON_TYPE]: "Icône" } },
            traitManager: { traits: { labels: { [ICON_PROP]: "Icône" } } },
        },
    });
};
