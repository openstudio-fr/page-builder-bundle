import { getIcon } from "../icons.js";

export default (editor) => {
    editor.DomComponents.addType("title", {
        extend: "text",
        isComponent: (el) => el.tagName && ["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName),
        extendFn: ["initToolbar"],
        model: {
            defaults: {
                tagName: "h1",
                content: "Lorem ipsum",
                traits: [
                    {
                        type: "select",
                        label: "Tag",
                        name: "tagName",
                        options: [
                            { value: "h1", name: "H1" },
                            { value: "h2", name: "H2" },
                            { value: "h3", name: "H3" },
                            { value: "h4", name: "H4" },
                            { value: "h5", name: "H5" },
                            { value: "h6", name: "H6" },
                        ],
                        changeProp: true,
                    },
                ],
            },
            initToolbar() {
                const toolbar = this.get("toolbar");
                if (!toolbar) return;

                const settingsButton = {
                    id: "title-settings",
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

    editor.BlockManager.add("title", {
        label: "Title",
        category: "Basic",
        select: true,
        media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.3 11.5h7.4V6.9l-.2-1.6a1 1 0 00-.5-.5c-.3-.2-.7-.3-1-.3h-.6v-.4h6.8v.4h-.6c-.4 0-.7.1-1 .3a1 1 0 00-.6.6L18 6.9v10.3c0 .8 0 1.3.2 1.6 0 .2.2.3.4.5.4.2.7.3 1.1.3h.6v.4h-6.8v-.4h.5c.7 0 1.2-.2 1.5-.6.2-.3.3-.9.3-1.8v-4.9H8.3v4.9l.1 1.6.5.5c.3.2.7.3 1 .3h.7v.4H3.7v-.4h.6c.7 0 1.1-.2 1.4-.6.2-.3.3-.9.3-1.8V6.9L6 5.3a1 1 0 00-.5-.5l-1-.3h-.7v-.4h6.9v.4H10c-.4 0-.8.1-1 .3a1 1 0 00-.6.6l-.1 1.5v4.6z"/></svg>`,
        content: { type: "title" },
    });

    editor.I18n.addMessages({
        fr: {
            blockManager: { labels: { title: "Titre" } },
            domComponents: { names: { title: "Titre" } },
            traitManager: { traits: { labels: { tagName: "Balise" } } },
        },
    });
};
