import { getIcon } from "../icons.js";

export default (editor) => {
    editor.Commands.add("pb:save", {
        run: (editor) => editor.store(),
    });

    editor.Panels.addButton("options", {
        id: "save",
        label: getIcon("action:save"),
        command: "pb:save",
        attributes: { title: "Enregistrer" },
    });
};
