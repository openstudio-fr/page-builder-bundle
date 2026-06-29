import { injectEditorOnlyStyles } from "../../utils/index.js";
import * as tblHelper from "./utils.js";

export default (editor, options = {}) => {
    editor.on("load", () => {
        const css = `
        .column-actions {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="%23ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h3M3 21h3m0 0h4a2 2 0 0 0 2-2V9M6 21V9m0-6h4a2 2 0 0 1 2 2v4M6 3v6M3 9h3m0 0h6m-9 6h9m3-3h3m0 0h3m-3 0v3m0-3V9"/></svg>');
            background-size: 23px 23px;
            background-repeat: no-repeat;
            content: '';
            height: 23px;
            width: 23px;
            margin: 2px 3px;
        }
        .table-toolbar-submenu-run-command {
            margin: 2px 3px;
            padding: 2px;
            cursor: pointer;
        }
        .row-actions {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="%23ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v3m18-3v3m0 0v4a2 2 0 0 1-2 2H9m12-6H9M3 6v4a2 2 0 0 0 2 2h4M3 6h6m0-3v3m0 0v6m6-9v9m-3 3v3m0 0v3m0-3h3m-3 0H9"/></svg>');
            background-size: 23px 23px;
            background-repeat: no-repeat;
            content: '';
            height: 23px;
            width: 23px;
            margin: 2px 3px;
        }
        .new-table-form label {
            min-width: 160px;
            display: inline-block;
        }
        .new-table-form .form-control {
            padding: 3px 5px;
            margin-bottom: 10px;
        }
        .new-table-form .error {
            color: red;
        }
        #table-button-create-new {
            margin-top: 10px;
        }
        .table-cell-highlight {
            background-color: #ffcccc !important;
        }
        `;

        const head = document.head || document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));

        const container = options.container ?? document;

        container.addEventListener("click", (event) => {
            const target = event.target.matches("li.table-toolbar-submenu-run-command")
                ? event.target
                : event.target.closest("li.table-toolbar-submenu-run-command");
            if (target) {
                editor.runCommand(target.dataset.command);
            }
        });

        container.addEventListener("click", (event) => {
            if (event.target.matches("input#table-button-create-new")) {
                tblHelper.updateAttributesAndCloseModal(editor, event.target.dataset.componentId);
            }
        });
    });

    editor.on("component:add", (model) => {
        if (model.attributes.type === "customTable" && model.components().length === 0) {
            editor.runCommand("open-table-settings-modal", { model });
        }
    });

    editor.on("component:selected", (component) => {
        if (component.get("type") === options.componentCell || component.get("type") === options.componentCellHeader) {
            component.set("toolbar", tblHelper.getCellToolbar(editor));
        }
        if (component.get("type") === "customTable") {
            component.set("toolbar", tblHelper.getTableToolbar(component, editor));
        }
    });

    injectEditorOnlyStyles(
        editor,
        `td:empty::before {
            content: "Cellule vide";
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            height: 100%;
            border: 2px solid white;
        }`,
    );
};
