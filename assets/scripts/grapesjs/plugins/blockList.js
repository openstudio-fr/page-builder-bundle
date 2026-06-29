import { getIcon } from "../icons.js";
import { injectEditorOnlyStyles } from "../utils/index.js";

export default (editor) => {
    editor.DomComponents.addType("list-item", {
        extend: "text",
        isComponent: (el) => ["LI"].includes(el.tagName),
        model: {
            defaults: {
                tagName: "li",
                content: "list item",
                draggable: ["ul", "ol"],
            },
            getAttrToHTML(opts) {
                const attrs = Object.getPrototypeOf(this).__proto__.getAttrToHTML.call(this, opts);
                delete attrs.draggable;
                return attrs;
            },
            toHTML(opts) {
                const classes = this.get("classes");
                const gjsClasses = classes.filter((c) => c.get("name")?.startsWith("gjs-"));

                if (!gjsClasses.length) {
                    return Object.getPrototypeOf(this).__proto__.toHTML.call(this, opts);
                }

                gjsClasses.forEach((c) => classes.remove(c, { silent: true }));
                const html = Object.getPrototypeOf(this).__proto__.toHTML.call(this, opts);
                gjsClasses.forEach((c) => classes.add(c, { silent: true }));
                return html;
            },
            removed() {
                const parent = this.parent({ prev: true });
                if (parent && parent.tagName === "ol") {
                    parent.view?.render();
                }
            },
        },
    });

    editor.Components.addType("list", {
        isComponent: (el) => ["UL", "OL"].includes(el.tagName),
        extendFn: ["initToolbar"],
        model: {
            defaults: {
                tagName: "ul",
                components: [
                    { type: "list-item", content: "Premier élément" },
                    { type: "list-item", content: "Second élément" },
                    { type: "list-item", content: "Troisième élément" },
                ],
                droppable: (el) => el && el.get("tagName") === "li",
                traits: [
                    {
                        type: "select",
                        label: "Tag",
                        name: "tagName",
                        options: [
                            { value: "ul", name: "UL" },
                            { value: "ol", name: "OL" },
                        ],
                        changeProp: true,
                    },
                ],
            },
            initToolbar() {
                const toolbar = this.get("toolbar");
                if (!toolbar) return;

                const addButton = {
                    id: "list-add-item",
                    attributes: { title: "Ajouter un élément" },
                    label: getIcon("action:add:list"),
                    command: "toolbar:add-list-item",
                };
                if (!toolbar.find((item) => item.id === addButton.id)) {
                    toolbar.unshift(addButton);
                }
                const settingsButton = {
                    id: "list-settings",
                    attributes: { title: "Réglages" },
                    label: getIcon("action:settings"),
                    command: (editor) => editor.Panels.getButton("views", "open-tm").set("active", true),
                };
                if (!toolbar.find((item) => item.id === settingsButton.id)) {
                    toolbar.unshift(settingsButton);
                }
            },
        },
    });

    injectEditorOnlyStyles(
        editor,
        `ul:empty::before, ol:empty::before {
            content: "Liste vide";
            color: #999;
            display: block;
            text-align: center;
            background: #f0f0f0;
            padding: 10px;
        }`,
    );

    // Pressing Enter while editing a list item adds a sibling item instead of inserting a <br>.
    // Attached in capture phase so it runs before the RTE keydown handlers and contenteditable defaults.
    editor.on("rte:enable", (view) => {
        if (view?.model?.get("type") !== "list-item") return;

        const canvasDoc = editor.Canvas.getDocument();

        view._listItemEnterHandler = (e) => {
            if (e.key !== "Enter") return;
            if (!view.el.contains(canvasDoc.activeElement) && canvasDoc.activeElement !== view.el) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const model = view.model;
            const parent = model.parent();
            if (!parent) return;

            view.onDisable?.();

            const idx = parent.components().indexOf(model);
            const newItem = parent.components().add({ type: "list-item", content: "" }, { at: idx + 1 });
            editor.select(newItem);

            editor.Canvas.getWindow().requestAnimationFrame(() => {
                const newView = newItem.getView();
                if (!newView) return;
                newView.onActive?.();
                newView.el.focus();
            });
        };

        canvasDoc.addEventListener("keydown", view._listItemEnterHandler, true);
    });

    editor.on("rte:disable", (view) => {
        if (!view?._listItemEnterHandler) return;
        editor.Canvas.getDocument().removeEventListener("keydown", view._listItemEnterHandler, true);
        delete view._listItemEnterHandler;
    });

    editor.Commands.add("toolbar:add-list-item", {
        run(ed, _, opts = {}) {
            const component = opts.component || ed.getSelected();
            if (component) {
                component.append({ type: "list-item", content: "Nouvel élément" });
            }
        },
    });

    editor.BlockManager.add("list", {
        label: "Liste",
        category: "Basic",
        select: true,
        media: getIcon("block:list"),
        content: { type: "list" },
    });

    editor.I18n.addMessages({
        fr: {
            blockManager: { labels: { list: "Liste" } },
            domComponents: { names: { list: "Liste", "list-item": "Élément de liste" } },
            traitManager: { traits: { labels: { tagName: "Balise" } } },
        },
    });
};
