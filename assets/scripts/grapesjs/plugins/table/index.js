import onLoad from "./onLoad.js";
import components from "./components/index.js";
import blocks from "./blocks.js";
import commands from "./commands/index.js";

export default (editor, options = {}) => {
    const optionsUpdated = {
        tblResizable: true,
        cellsResizable: true,
        componentCell: "customCell",
        componentCellHeader: "customHeaderCell",
        componentRow: "customRow",
        ...options,
    };

    onLoad(editor, optionsUpdated);
    components(editor, optionsUpdated);
    blocks(editor, optionsUpdated);
    commands(editor, optionsUpdated);
};
