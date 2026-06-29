export default (editor) => {
    editor.DomComponents.addType("divider", {
        isComponent: (el) => el.tagName === "HR",
        model: {
            defaults: { tagName: "hr" },
        },
    });

    editor.BlockManager.add("divider", {
        label: "Divider",
        category: "Basic",
        select: true,
        media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"/></svg>`,
        content: { type: "divider" },
    });

    editor.I18n.addMessages({
        fr: {
            blockManager: { labels: { divider: "Séparateur" } },
            domComponents: { names: { divider: "Séparateur" } },
        },
    });
};
