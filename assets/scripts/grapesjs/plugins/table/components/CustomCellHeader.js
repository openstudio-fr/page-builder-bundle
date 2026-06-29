export default (domComponents, options) => {
    domComponents.addType(options.componentCellHeader, {
        isComponent: (el) => el.tagName === "TH",
        model: {
            defaults: {
                name: "Header Cell",
                tagName: "th",
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
