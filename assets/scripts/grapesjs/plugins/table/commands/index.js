import * as tblHelper from "../utils.js";

export default (editor, options = {}) => {
    const commands = editor.Commands;

    commands.add("table-show-columns-operations", () => {
        tblHelper.updateTableToolbarSubmenu(editor, "columns", "rows", options.componentCell, options.componentCellHeader);
    });

    commands.add("table-show-rows-operations", () => {
        tblHelper.updateTableToolbarSubmenu(editor, "rows", "columns", options.componentCell, options.componentCellHeader);
    });

    commands.add("table-toggle-header", () => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCellHeader)) {
            const table = selected.parent().parent();
            tblHelper.toggleHeaderRow(table, options.componentRow, options.componentCellHeader, true);
        }
    });

    commands.add("table-select", (editor) => {
        editor.runCommand("core:component-exit");
        editor.runCommand("core:component-exit");
    });

    commands.add("table-insert-row-above", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell)) {
            const rowComponent = selected.parent();
            const table = selected.parent().parent();
            tblHelper.insertRow(table, rowComponent.collection.indexOf(rowComponent), options.componentRow, options.componentCell, true);
            tblHelper.refreshEditorSelected(editor);
        }
    });

    commands.add("table-insert-row-below", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const rowComponent = selected.parent();
            const table = selected.parent().parent();
            tblHelper.insertRow(table, rowComponent.collection.indexOf(rowComponent) + 1, options.componentRow, options.componentCell, true);
            tblHelper.refreshEditorSelected(editor);
        }
    });

    commands.add("table-insert-column-left", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const table = selected.parent().parent();
            const columnIndex = selected.collection.indexOf(selected);
            tblHelper.insertColumn(table, columnIndex, options.componentCell, options.componentCellHeader, true);
            tblHelper.refreshEditorSelected(editor);
        }
    });

    commands.add("table-insert-column-right", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const table = selected.parent().parent();
            const columnIndex = selected.collection.indexOf(selected);
            tblHelper.insertColumn(table, columnIndex + 1, options.componentCell, options.componentCellHeader, true);
            tblHelper.refreshEditorSelected(editor);
        }
    });

    commands.add("table-delete-row", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const table = selected.parent().parent();
            editor.selectRemove(selected);
            const rowComponent = selected.parent();
            const rowIndex = rowComponent.collection.indexOf(rowComponent);
            tblHelper.removeRow(table, rowIndex, true);
            if (table.components().length === 0) {
                table.parent().remove(table);
            }
        }
    });

    commands.add("table-delete-column", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const table = selected.parent().parent();
            const columnIndex = selected.collection.indexOf(selected);
            editor.selectRemove(selected);
            tblHelper.removeColumn(table, columnIndex, true);
            if (table.components().every((component) => component.components().length === 0)) {
                table.parent().remove(table);
            }
        }
    });

    commands.add("table-merge-cells-right", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            let currentColspan = selected.getAttributes()["colspan"] ? selected.getAttributes()["colspan"] : 1;
            const columnIndex = selected.collection.indexOf(selected);
            const rowIndex = selected.parent().collection.indexOf(selected.parent());
            const table = selected.parent().parent();
            const mergedRowsIndexEnd = selected.getAttributes()["rowspan"] > 0 ? selected.getAttributes()["rowspan"] : 1;

            for (let index = 0; index < mergedRowsIndexEnd; index++) {
                const componentToRemove = table
                    .components()
                    .at(rowIndex + index)
                    .components()
                    .at(index === 0 ? columnIndex + 1 : columnIndex);
                componentToRemove.components().forEach((component) => selected.append(component.toHTML()));
                componentToRemove.remove();
            }

            selected.addAttributes({ colspan: ++currentColspan });
            tblHelper.refreshEditorSelected(editor);
            if (columnIndex + 1 === selected.parent().components().length) {
                const button = document.getElementById("button-merge-cells-right");
                if (button) button.style.display = "none";
            }
        }
    });

    commands.add("table-merge-cells-down", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell)) {
            const currentColspan = selected.getAttributes()["colspan"] ? selected.getAttributes()["colspan"] : 1;
            let currentRowspan = selected.getAttributes()["rowspan"] ? selected.getAttributes()["rowspan"] : 1;
            const columnIndex = selected.collection.indexOf(selected);
            const rowIndex = selected.parent().collection.indexOf(selected.parent()) + currentRowspan - 1;
            const table = selected.parent().parent();

            for (let index = 0; index < currentColspan; index++) {
                const componentToRemove = table
                    .components()
                    .at(rowIndex + 1)
                    .components()
                    .at(columnIndex);
                componentToRemove.components().forEach((component) => selected.append(component.toHTML()));
                componentToRemove.remove();
            }

            selected.addAttributes({ rowspan: ++currentRowspan });
            tblHelper.refreshEditorSelected(editor);
            if (rowIndex + 2 === table.components().length) {
                const button = document.getElementById("button-merge-cells-down");
                if (button) button.style.display = "none";
            }
        }
    });

    commands.add("table-unmerge-cells", (editor) => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell) || selected.is(options.componentCellHeader)) {
            const currentColspan = selected.getAttributes()["colspan"] ? selected.getAttributes()["colspan"] : 1;
            const currentRowspan = selected.getAttributes()["rowspan"] ? selected.getAttributes()["rowspan"] : 1;
            const columnIndex = selected.collection.indexOf(selected);
            const rowIndex = selected.parent().collection.indexOf(selected.parent());
            const table = selected.parent().parent();

            for (let i = 0; i < currentRowspan; i++) {
                for (let x = 0; x < currentColspan; x++) {
                    if (i === 0 && currentColspan === 1) {
                        continue;
                    }
                    if (i === 0 && x === 0 && currentColspan > 1) {
                        x = 1;
                    }
                    table
                        .components()
                        .at(rowIndex + i)
                        .components()
                        .add({ type: options.componentCell }, { at: i === 0 ? columnIndex + 1 : columnIndex });
                }
            }

            selected.setAttributes({ colspan: 1 });
            selected.setAttributes({ rowspan: 1 });

            tblHelper.refreshEditorSelected(editor);
            const buttonDown = document.getElementById("button-merge-cells-down");
            const buttonRight = document.getElementById("button-merge-cells-right");
            if (buttonDown) buttonDown.style.display = "";
            if (buttonRight) buttonRight.style.display = "";
        }
    });

    commands.add("open-traits-settings", {
        run(editor) {
            editor.Panels.getButton("views", "open-tm").set("active", true);
        },
    });

    commands.add("open-table-settings-modal", {
        run(editor, sender, opts = {}) {
            editor.Modal.open({
                title: "Create new Table",
                content: `
                    <div class="new-table-form">
                        <div>
                            <label for="nColumns">Number of columns</label>
                            <input type="number" class="form-control" value="${opts.model.props()["nColumns"]}" name="nColumns" id="nColumns" min="1" />
                        </div>
                        <div>
                            <label for="nRows">Number of rows</label>
                            <input type="number" class="form-control" value="${opts.model.props()["nRows"]}" name="nRows" id="nRows" min="1" />
                        </div>
                        <div class="error" style="display: none;"></div>
                    </div>
                    <input id="table-button-create-new" type="button" value="Create Table" data-component-id="${opts.model.cid}" />
                `,
            }).onceClose(() => {
                if (!opts.model.components() || opts.model.components().length === 0) {
                    opts.model.remove();
                }
                this.stopCommand();
            });
        },
        stop(editor) {
            editor.Modal.close();
        },
    });

    commands.add("table-row-move-up", () => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell)) {
            tblHelper.rowMove(selected.parent(), -1);
            tblHelper.refreshEditorSelected(editor);
        }
    });

    commands.add("table-row-move-down", () => {
        const selected = editor.getSelected();
        if (selected.is(options.componentCell)) {
            tblHelper.rowMove(selected.parent(), 1);
            tblHelper.refreshEditorSelected(editor);
        }
    });
};
