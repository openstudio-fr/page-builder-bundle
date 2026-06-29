export default (domComponents, options) => {
    domComponents.addType(options.componentCell, {
        isComponent: (el) => el.tagName === "TD",
        model: {
            defaults: {
                name: "Cell",
                tagName: "td",
                draggable: false,
                removable: false,
                resizable: options.cellsResizable,
                classes: [],
            },
        },
        view: {
            onRender() {
                const model = this.model;
                this.el.addEventListener("dblclick", function () {
                    if (this.children.length === 0) {
                        model.components().add({ type: "text", content: "Text" });
                    }
                });
            },
        },
    });
};
