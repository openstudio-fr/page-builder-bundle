/**
 * Move existing blocks (from third-party plugins) into a chosen category.
 */
export default (editor, options = {}) => {
    if (!Array.isArray(options.blocks)) {
        console.warn("reorganizeBlocks plugin: no blocks option provided, or not an array");
        return;
    }

    const bm = editor.BlockManager;
    for (const block of options.blocks) {
        const { id, category } = block;
        if (typeof id !== "string" || typeof category !== "string") {
            console.warn("reorganizeBlocks plugin: block id or category is not a string:", block);
            continue;
        }

        const bmBlock = bm.remove(id);
        if (!bmBlock) {
            console.warn(`reorganizeBlocks plugin: block with id "${id}" not found in Block Manager`);
            continue;
        }

        bmBlock.set("category", category);
        bm.add(id, bmBlock);
    }
};
