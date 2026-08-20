/**
 * Persist the editor content into hidden form fields.
 * On store, the project data, HTML and CSS are written to the fields whose ids
 * are given in options.fields ({ data, html, css }). The host form submission then persists them.
 * On load, the project data is read back from the data field, and the CSS field
 * is read back once the editor is ready when the project brought no styles of
 * its own: a page whose HTML and CSS were written outside the editor, by an
 * import or by the application seeding it, would otherwise open with its rules
 * missing and have them overwritten with the empty output of the editor on the
 * first save.
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
            let data;

            try {
                data = JSON.parse(projectDataEl.value || "{}");
            } catch {
                console.error("formStorage plugin: invalid JSON in the data field, starting from an empty project");
                return {};
            }

            // A project with no page is not a project. Loading one makes the
            // editor drop whatever the canvas started from, and the next save
            // writes that emptiness over the HTML and the CSS of the page.
            // Handing back nothing instead leaves the canvas as the host
            // rendered it, which is where an imported page lives.
            if (!Array.isArray(data.pages) || data.pages.length === 0) {
                return {};
            }

            return data;
        },
        store(data) {
            // The media library is the source of truth for assets, reloaded on load.
            data.assets = [];

            projectDataEl.value = JSON.stringify(data);
            projectHtmlEl.value = editor.getHtml();
            projectCssEl.value = editor.getCss();
        },
    });

    // Added to the editor rather than returned by load(): a project with styles
    // and no pages makes the editor drop the markup it started from, which is
    // exactly the markup an imported page carries in the canvas. Adding the
    // rules once the editor is ready leaves both in place, and the guard means
    // a project that brought its own styles is never touched.
    editor.on("load", () => {
        const css = (projectCssEl.value || "").trim();

        if (css !== "" && editor.getCss().trim() === "") {
            editor.Css.addRules(css);
        }
    });
};
