import PageBuilderController from "@openstudio/page-builder-bundle/controllers/page_builder_controller.js";

export default class extends PageBuilderController {
    initEditor(options = {}) {
        super.initEditor(options);
        window.__pbEditor = this.editor;
    }
}
