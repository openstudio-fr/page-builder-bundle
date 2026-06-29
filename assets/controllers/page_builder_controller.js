import { Controller } from "@hotwired/stimulus";
import { createEditor } from "../scripts/grapesjs/editor.js";
import { PluginManager } from "../scripts/grapesjs/pluginManager.js";

/**
 * Base page builder controller. Works out of the box (Level 0): structural blocks,
 * form storage and a save button. Extend it to register business plugins by
 * overriding configurePlugins(), or to tune the editor by overriding initEditor().
 *
 * stimulusFetch: 'lazy'
 */
export default class extends Controller {
    static targets = ["editor", "panels", "blocks"];
    static values = {
        icons: { type: Array, default: [] },
        options: { type: Object, default: {} },
        fields: { type: Object, default: {} },
        endpoints: { type: Object, default: {} },
        palette: { type: Array, default: [] },
        context: { type: String, default: "" },
    };

    connect() {
        this.preventFormSubmit = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.element.addEventListener("keydown", this.preventFormSubmit);

        this.initPluginManager();
        this.initEditor();
    }

    disconnect() {
        this.element.removeEventListener("keydown", this.preventFormSubmit);
        this.destroyEditor();
    }

    initPluginManager() {
        this.pluginManager = new PluginManager();
        this.configurePlugins();
    }

    configurePlugins() {
        const plugins = [
            "pb:init-categories",
            "pb:title",
            "pb:section",
            "grapesjs:blocks-basic",
            "grapesjs:preset-webpage",
            "pb:list",
            "pb:divider",
            { name: "pb:icon", options: { icons: this.iconsValue } },
            "pb:accordion",
            "grapesjs:custom-code",
            "grapesjs:countdown",
            { name: "pb:table", options: { container: this.editorTarget } },
            "pb:reorganize-blocks",
        ];

        if (this.hasFormFields()) {
            plugins.push({ name: "pb:form-storage", options: { fields: this.fieldsValue } });
            plugins.push("pb:button-save");
        }

        if (this.endpointsValue?.uploadImage) {
            plugins.push({ name: "pb:asset-manager-upload", options: { endpoints: this.endpointsValue, context: this.contextValue } });
        }

        this.pluginManager.initActivePlugins(plugins);
    }

    initEditor(options = {}) {
        if (this.editor) {
            throw new Error("Editor is already initialized");
        }

        const panelsElements = this.hasPanelsTarget ? this.panelsTargets : undefined;
        const blocksContainer = this.hasBlocksTarget ? this.blocksTarget : undefined;

        const colorPicker = this.buildColorPicker();

        const baseOptions = {
            ...(this.hasFormFields() ? { storageManager: { type: "form" } } : {}),
            richTextEditor: { onPaste: this.sanitizePaste.bind(this) },
            ...(colorPicker ? { colorPicker } : {}),
        };

        this.editor = createEditor(this.editorTarget, this.pluginManager, {
            panelsElements,
            blocksContainer,
            ...baseOptions,
            ...options,
            ...(this.optionsValue ?? {}),
        });

        this.editor.StyleManager.removeProperty("typography", "font-family");

        this.editor.Panels.getButton("options", "fullscreen").set("command", (editor) => {
            editor.stopCommand("fullscreen");
            editor.runCommand("fullscreen", { target: this.element });
        });
    }

    destroyEditor() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    }

    hasFormFields() {
        const fields = this.fieldsValue ?? {};
        return Boolean(fields.data && fields.html && fields.css);
    }

    buildColorPicker() {
        if (!Array.isArray(this.paletteValue) || this.paletteValue.length === 0) {
            return null;
        }
        return {
            palette: this.paletteValue,
            allowEmpty: true,
            showInitial: true,
            showPaletteOnly: true,
            preferredFormat: "hex",
            togglePaletteOnly: false,
        };
    }

    // Strip dangerous tags, inline event handlers, external sources and layout-breaking styles on paste.
    sanitizePaste({ ev, rte }) {
        ev.preventDefault();
        const { clipboardData } = ev;
        const html = clipboardData.getData("text/html");

        if (!html) {
            const text = clipboardData.getData("text");
            rte.doc.execCommand("insertHTML", false, text.replace(/(?:\r\n|\r|\n)/g, "<br/>"));
            return;
        }

        const doc = new DOMParser().parseFromString(html, "text/html");

        doc.querySelectorAll("style, script, iframe, object, embed, form, svg").forEach((el) => el.remove());

        doc.querySelectorAll("*").forEach((el) => {
            [...el.attributes].filter((attr) => attr.name.startsWith("on")).forEach((attr) => el.removeAttribute(attr.name));
            el.removeAttribute("class");
            el.removeAttribute("id");

            if (el.hasAttribute("style")) {
                el.setAttribute("style", el.getAttribute("style").replace(/\bmso-[^:]+:[^;]+;?\s*/gi, ""));
                ["fontFamily", "lineHeight", "letterSpacing", "color", "backgroundImage", "backgroundColor", "background"].forEach((prop) => (el.style[prop] = ""));
                ["position", "top", "right", "bottom", "left", "zIndex", "float", "clear", "overflow", "overflowX", "overflowY", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight"].forEach(
                    (prop) => (el.style[prop] = ""),
                );
                if (/^h[1-6]$/i.test(el.tagName)) {
                    el.style.fontSize = "";
                }
                if (!el.getAttribute("style").trim()) {
                    el.removeAttribute("style");
                }
            }
        });

        doc.querySelectorAll("img").forEach((el) => ["src", "srcset", "data-src", "data-srcset", "loading", "decoding"].forEach((attr) => el.removeAttribute(attr)));
        doc.querySelectorAll("a[href]").forEach((el) => el.removeAttribute("href"));
        doc.querySelectorAll("font").forEach((el) => {
            const fragment = doc.createDocumentFragment();
            while (el.firstChild) fragment.appendChild(el.firstChild);
            el.parentNode.replaceChild(fragment, el);
        });

        rte.doc.execCommand("insertHTML", false, doc.body.innerHTML);
    }
}
