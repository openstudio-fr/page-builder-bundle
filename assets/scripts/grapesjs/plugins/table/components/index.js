import CustomTable from "./CustomTable.js";
import CustomRow from "./CustomRow.js";
import CustomCellHeader from "./CustomCellHeader.js";
import CustomCell from "./CustomCell.js";

export default (editor, options = {}) => {
    const domComponents = editor.DomComponents;

    CustomTable(domComponents, options);
    CustomRow(domComponents, options);
    CustomCellHeader(domComponents, options);
    CustomCell(domComponents, options);
};
