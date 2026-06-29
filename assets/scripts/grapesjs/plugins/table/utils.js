const t = (editor, key) => editor.I18n.t(`pageBuilder.table.${key}`);

export const getCellToolbar = (editor) => {
    const toolbar = [
        { attributes: { class: "column-actions columns-operations", title: t(editor, "columnsOperations") }, command: "table-show-columns-operations" },
        { attributes: { class: "row-actions rows-operations", title: t(editor, "rowsOperations") }, command: "table-show-rows-operations" },
        { attributes: { class: "fa fa-level-up", title: t(editor, "moveRowUp") }, command: "table-row-move-up" },
        { attributes: { class: "fa fa-level-down", title: t(editor, "moveRowDown") }, command: "table-row-move-down" },
        { attributes: { class: "fa fa-arrow-up", title: t(editor, "selectParent") }, command: "table-select" },
    ];
    const selected = editor.getSelected();
    if (selected.getAttributes()["colspan"] > 1 || selected.getAttributes()["rowspan"] > 1) {
        toolbar.push({ attributes: { class: "fa fa-th-large", title: t(editor, "unmergeCells") }, command: "table-unmerge-cells" });
    }
    return toolbar;
};

export const getTableToolbar = (component, editor) => {
    const tb = component.get("toolbar");
    if (!tb.find((o) => o.command === "open-traits-settings")) {
        tb.push({ command: "open-traits-settings", attributes: { class: "fa fa-cog", title: t(editor, "settings") } });
    }
    return tb;
};

export function insertColumn(tableComponent, addAtIndex, componentCell, componentCellHeader, updateProps = false) {
    tableComponent.components().forEach((component, index) => {
        if (index === 0 && tableComponent.props().hasHeaders) {
            component.components().add({ type: componentCellHeader }, { at: addAtIndex });
        } else {
            component.components().add({ type: componentCell }, { at: addAtIndex });
        }
    });

    if (updateProps) {
        tableComponent.set({ nColumns: Number(tableComponent.props().nColumns) + 1 });
    }
}

export function insertRow(tableComponent, addAtIndex, componentRow, componentCell, updateProps = false) {
    const components = [];
    tableComponent
        .components()
        .at(0)
        .components()
        .models.forEach((model) => {
            const colspan = model.getAttributes()["colspan"] ? model.getAttributes()["colspan"] : 1;
            for (let i = 0; i < colspan; i++) {
                components.push({ type: componentCell });
            }
        });
    tableComponent.components().add({ type: componentRow, components }, { at: addAtIndex });

    if (updateProps) {
        tableComponent.set({ nRows: Number(tableComponent.props().nRows) + 1 });
    }
}

export function removeColumn(tableComponent, removeAtIndex, updateProps = false) {
    tableComponent.components().forEach((component) => {
        component.components().at(removeAtIndex).remove();
    });
    if (updateProps) {
        tableComponent.set({ nColumns: Number(tableComponent.props().nColumns) - 1 });
    }
}

export function removeRow(tableComponent, removeAtIndex, updateProps = false) {
    tableComponent.components().at(removeAtIndex).remove();
    if (updateProps) {
        tableComponent.set({ nRows: Number(tableComponent.props().nRows) - 1 });
    }
}

export function toggleHeaderRow(tableComponent, componentRow, componentCellHeader, updateProps = false) {
    const toggleOn = updateProps === false ? tableComponent.props().hasHeaders : !tableComponent.props().hasHeaders;
    if (toggleOn) {
        const headers = [];
        for (let index = 0; index < tableComponent.props().nColumns; index++) {
            headers.push({ type: componentCellHeader });
        }
        tableComponent.components().add({ type: componentRow, components: headers }, { at: 0 });
    } else {
        tableComponent.components().at(0).remove();
    }
    if (updateProps) {
        tableComponent.set({ hasHeaders: toggleOn });
    }
}

export function highlightCellsWithSize(table) {
    table.components().forEach((row) => {
        row.components().forEach((cell) => {
            const cellStyle = cell.getStyle();
            if (cellStyle && (cellStyle.width || cellStyle.height)) {
                if (cell.getClasses().includes("table-cell-highlight")) {
                    cell.removeClass("table-cell-highlight");
                } else {
                    cell.addClass("table-cell-highlight");
                }
            }
        });
    });
}

export function clearCellsWithSize(table) {
    table.components().forEach((row) => {
        row.components().forEach((cell) => {
            const cellStyle = cell.getStyle();
            if (cellStyle) {
                if (cellStyle.width) cell.removeStyle("width");
                if (cellStyle.height) cell.removeStyle("height");
                if (cell.getClasses().includes("table-cell-highlight")) {
                    cell.removeClass("table-cell-highlight");
                }
            }
        });
    });
}

export function updateAttributesAndCloseModal(editor, componentId) {
    const nRows = parseInt(document.getElementById("nRows").value);
    const nColumns = parseInt(document.getElementById("nColumns").value);
    const errorDiv = document.querySelector(".new-table-form .error");

    const errors = [];
    if (!nColumns) {
        errors.push(t(editor, "errorMissingColumns"));
    } else if (nColumns <= 0) {
        errors.push(t(editor, "errorColumnsPositive"));
    }
    if (!nRows) {
        errors.push(t(editor, "errorMissingRows"));
    } else if (nRows <= 0) {
        errors.push(t(editor, "errorRowsPositive"));
    }

    if (errors.length > 0) {
        errorDiv.textContent = errors.join(" ");
        errorDiv.style.display = "block";
        return;
    }

    const tableModel = getAllComponents(editor.getWrapper()).find((model) => model.cid === componentId);
    if (!tableModel) {
        errorDiv.textContent = t(editor, "errorComponentNotFound");
        errorDiv.style.display = "block";
        console.error("Table component was not found in the editor, expected component ID:", componentId);
        return;
    }
    tableModel.props().nRows = nRows;
    tableModel.props().nColumns = nColumns;
    tableModel.createTable();
    editor.Modal.close();
}

export function updateTableToolbarSubmenu(editor, submenuToShow, submenuToHide, componentCell, componentCellHeader) {
    const selected = editor.getSelected();
    const currentMenu = document.querySelector("ul#toolbar-submenu-" + submenuToShow);
    if (currentMenu) {
        document.querySelectorAll(".toolbar-submenu").forEach((el) => (el.style.display = "none"));
        currentMenu.style.display = "block";
        return;
    }

    if (!selected || !(selected.is(componentCell) || selected.is(componentCellHeader))) {
        return;
    }

    const rowComponent = selected.parent();
    const hideMenu = document.querySelector("." + submenuToHide + "-operations .toolbar-submenu");
    if (hideMenu) {
        hideMenu.style.display = "none";
    }

    const showMenu = document.querySelector("." + submenuToShow + "-operations .toolbar-submenu");
    if (showMenu) {
        if (showMenu.style.display !== "none" && showMenu.style.display !== "") {
            showMenu.style.display = "none";
            return;
        }
        showMenu.style.display = "block";
        return;
    }

    let htmlString = "";
    if (submenuToShow === "rows") {
        const toolbar = document.querySelector(".gjs-toolbar");
        const toolbarLeft = toolbar ? toolbar.getBoundingClientRect().left : 0;
        htmlString =
            `<ul id="toolbar-submenu-rows" class="toolbar-submenu ` +
            (toolbarLeft > 150 ? "toolbar-submenu-right" : "") +
            `" style="display: none;">
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-row-above" ` +
            (selected.is(componentCellHeader) ? 'style="display: none;"' : "") +
            `><i class="fa fa-chevron-up" aria-hidden="true"></i> ${t(editor, "insertRowAbove")}</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-row-below"><i class="fa fa-chevron-down" aria-hidden="true"></i> ${t(editor, "insertRowBelow")}</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-delete-row" ` +
            (selected.is(componentCellHeader) ? 'style="display: none;"' : "") +
            `><i class="fa fa-trash" aria-hidden="true"></i> ${t(editor, "deleteRow")}</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-toggle-header" ` +
            (selected.is(componentCell) ? 'style="display: none;"' : "") +
            `><i class="fa fa-trash" aria-hidden="true"></i> ${t(editor, "removeHeader")}</li>
                <li id="button-merge-cells-right" class="table-toolbar-submenu-run-command" data-command="table-merge-cells-right" ` +
            (selected.collection.indexOf(selected) + 1 === selected.parent().components().length ? 'style="display: none;"' : "") +
            `><i class="fa fa-arrows-h" aria-hidden="true"></i> ${t(editor, "mergeCellRight")}</li>
            </ul>`;
    } else {
        const rowspan = selected.getAttributes()["rowspan"] ? selected.getAttributes()["rowspan"] : 0;
        const toolbar = document.querySelector(".gjs-toolbar");
        const toolbarLeft = toolbar ? toolbar.getBoundingClientRect().left : 0;
        htmlString =
            `<ul id="toolbar-submenu-columns" class="toolbar-submenu ` +
            (toolbarLeft > 150 ? "toolbar-submenu-right" : "") +
            `" style="display: none;">
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-column-left"><i class="fa fa-chevron-left" aria-hidden="true"></i> ${t(editor, "insertColumnLeft")}</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-column-right"><i class="fa fa-chevron-right" aria-hidden="true"></i> ${t(editor, "insertColumnRight")}</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-delete-column"><i class="fa fa-trash" aria-hidden="true"></i> ${t(editor, "deleteColumn")}</li>
                <li id="button-merge-cells-down" class="table-toolbar-submenu-run-command" data-command="table-merge-cells-down" ` +
            (rowComponent.collection.indexOf(rowComponent) + rowspan === rowComponent.parent().components().length || selected.is(componentCellHeader)
                ? 'style="display: none;"'
                : "") +
            `><i class="fa fa-arrows-v" aria-hidden="true"></i> ${t(editor, "mergeCellDown")}</li>
            </ul>`;
    }

    document.querySelectorAll(".toolbar-submenu").forEach((el) => (el.style.display = "none"));
    const operationsElement = document.querySelector("." + submenuToShow + "-operations");
    if (operationsElement && operationsElement.parentElement) {
        operationsElement.parentElement.insertAdjacentHTML("beforeend", htmlString);
    }
    const newMenu = document.querySelector("ul#toolbar-submenu-" + submenuToShow);
    if (newMenu) newMenu.style.display = "block";
}

export function refreshEditorSelected(editor) {
    const selected = editor.getSelected();
    editor.selectRemove(selected);
    setTimeout(() => editor.select(selected), 50);
}

export function getAllComponents(model, result = []) {
    result.push(model);
    model.components().each((mod) => getAllComponents(mod, result));
    return result;
}

export function rowMove(row, position) {
    const table = row.parent();
    const items = table.components();
    const index = items.indexOf(row);
    if (index === -1) return;

    const indexNew = index + position;
    if (indexNew > -1 && indexNew < items.length) {
        const rowCopy = items.at(index);
        items.remove(row);
        items.add(rowCopy, { at: indexNew });
    }
}
