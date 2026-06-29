import grapesjs from "grapesjs";

import fr from "grapesjs/locale/fr";
import addonFr from "./i18n/fr.js";

import "grapesjs/dist/css/grapes.min.css";
import "../../styles/page-builder.css";

export function createEditor(container, pluginManager, options = {}) {
    const { panelsElements = [], blocksContainer = undefined, externalStylesheets = [], wrapperClasses = "", ...otherOptions } = options;

    const finalOptions = {
        telemetry: false,
        height: "100%",
        width: "auto",
        fromElement: true,
        showOffsets: true,
        showOffsetsSelected: true,
        storageManager: false,
        deviceManager: {
            devices: [
                { id: "desktop", name: "Desktop", width: "" },
                { id: "tablet", name: "Tablet", width: "1024px", widthMedia: "1279px" },
                { id: "mobilePortrait", name: "Mobile portrait", width: "375px", widthMedia: "767px" },
            ],
        },
        ...otherOptions,
    };

    const editor = grapesjs.init({
        ...finalOptions,
        container,
        canvas: {
            ...finalOptions.canvas,
            styles: [...externalStylesheets, ...(finalOptions.canvas?.styles ?? [])],
        },
        i18n: {
            messages: { fr },
            messagesAdd: { fr: addonFr },
        },
        blockManager: {
            ...finalOptions.blockManager,
            appendTo: blocksContainer,
        },
        plugins: pluginManager.buildConfig(),
    });

    if (panelsElements.length > 0) {
        editor.on("command:run:preview", () => panelsElements.forEach((el) => el.classList.add("pb-hidden")));
        editor.on("command:stop:preview", () => panelsElements.forEach((el) => el.classList.remove("pb-hidden")));
    }

    editor.on("load", () => {
        if (blocksContainer) {
            editor.Panels.removeButton("views", "open-blocks");
        }
        editor.getWrapper().addClass(wrapperClasses);
    });

    return editor;
}
