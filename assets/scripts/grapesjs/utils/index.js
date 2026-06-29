export { openIconPickerModal } from "./IconPickerModal.js";

export const DATA_TYPE_ATTR = "data-type";

export const isComponentOfType = (type) => (component) => component.getAttribute?.(DATA_TYPE_ATTR) === type;

export const injectComponentType = (type) => ({ [DATA_TYPE_ATTR]: type });

export const isOneOfTypes =
    (...types) =>
    (component) =>
        types.some((type) => component.is(type));

export const isChildOfTypes =
    (...types) =>
    (component, parent) =>
        types.some((type) => parent.is(type));

/**
 * Inject styles available only inside the editor canvas (not exported with the content).
 * Used for placeholders of empty blocks.
 */
export const injectEditorOnlyStyles = (editor, styles) => {
    editor.on("load", () => {
        editor.Canvas.getDocument().head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
    });
};

export const renderError = (el, message) => {
    el.innerHTML = `<div class="pb-render-error">${message}</div>`;
};

export const renderWarning = (el, message) => {
    el.innerHTML = `<div class="pb-render-warning">${message}</div>`;
};

export const debounce = (fn, delay) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * Render factory for server-rendered composite blocks.
 * Calls `options.endpoints["render-template"]` with { templateName, parameters } and expects { content }.
 * The host owns the endpoint and the template allowlist.
 */
export function twigRendererFactory(templateName, params, options, hooks = {}) {
    const beforeRender = hooks.beforeRender || (() => true);
    const onRender = hooks.onRender || (({ json, el }) => (el.innerHTML = json.content));

    return async function ({ el }) {
        const view = this;
        const endpoint = options.endpoints?.["render-template"];

        if (!endpoint) {
            return renderError(el, "The render-template endpoint is not configured.");
        }

        if (!beforeRender(el, view)) {
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({
                    templateName,
                    parameters: typeof params === "function" ? params(el, view) : (params ?? {}),
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const json = await response.json();
            onRender({ json, el, view });
        } catch (error) {
            renderError(el, `Failed to render component "${templateName}".`);
            console.error(error);
        }
    };
}
