/**
 * Persist the editor content into hidden form fields.
 * On store, the project data, HTML and CSS are written to the fields whose ids
 * are given in options.fields ({ data, html, css }). The host form submission then persists them.
 * On load, the project data is read back from the data field.
 */
export default (editor, options = {}) => {
    const { fields = {} } = options;
    const projectDataEl = document.getElementById(fields.data);
    const projectHtmlEl = document.getElementById(fields.html);
    const projectCssEl = document.getElementById(fields.css);

    if (!projectDataEl || !projectHtmlEl || !projectCssEl) {
        console.warn("formStorage plugin: missing one of the data/html/css form fields");
        return;
    }

    editor.Storage.add("form", {
        load() {
            return JSON.parse(projectDataEl.value || "{}");
        },
        store(data) {
            // The media library is the source of truth for assets, reloaded on load.
            data.assets = [];

            projectDataEl.value = JSON.stringify(data);
            projectHtmlEl.value = editor.getHtml();
            projectCssEl.value = editor.getCss();
        },
    });
};
