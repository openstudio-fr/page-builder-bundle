/**
 * Block categories are created in their order of first appearance in the Block Manager.
 * This plugin must run before any block is added so the category order is fixed,
 * by creating then removing one temporary block per category.
 */
export default (editor, options = {}) => {
    if (!Array.isArray(options.categories)) {
        console.warn("initCategories plugin: no categories option provided, or not an array");
        return;
    }

    const bm = editor.BlockManager;
    for (const category of options.categories) {
        if (typeof category !== "string") {
            console.warn("initCategories plugin: category is not a string:", category);
            continue;
        }
        bm.add(`__tmp-category-${category}__`, {
            label: "",
            category,
            attributes: { style: "display:none" },
        });
    }

    editor.on("load", () => {
        for (const category of options.categories) {
            editor.BlockManager.remove(`__tmp-category-${category}__`);
        }
    });
};
