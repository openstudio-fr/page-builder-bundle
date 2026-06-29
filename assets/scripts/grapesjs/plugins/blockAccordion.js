import { isComponentOfType, isOneOfTypes, isChildOfTypes, injectComponentType, DATA_TYPE_ATTR } from "../utils/index.js";

const PLUGIN_PREFIX = "gjs-plg-";
const BLOCKS_CATEGORY = "Advanced";

const ACCORDION_TYPE = "accordion";
const ACCORDION_GROUP_TYPE = `${ACCORDION_TYPE}-group`;
const ACCORDION_HEADER_TYPE = `${ACCORDION_TYPE}-header`;
const ACCORDION_CONTENT_TYPE = `${ACCORDION_TYPE}-content`;
const ACCORDION_MARKER_TYPE = `${ACCORDION_TYPE}-marker`;

const ACCORDION_HEADER_CLASS = `${PLUGIN_PREFIX}${ACCORDION_HEADER_TYPE}`;
const ACCORDION_MARKER_CLASS = `${PLUGIN_PREFIX}${ACCORDION_MARKER_TYPE}`;
const ACCORDION_CONTENT_CLASS = `${PLUGIN_PREFIX}${ACCORDION_CONTENT_TYPE}`;
const ACCORDION_MARKER_OPEN_CLASS = `${ACCORDION_MARKER_CLASS}-open`;

const ICONS = {
    accordion:
        '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V8.154H5v10.23q0 .232.192.424t.423.192"/></svg>',
    accordionGroup:
        '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.116 16h10.769q.23 0 .423-.192t.192-.423V6h-12v9.385q0 .23.192.423t.423.192m0 1q-.69 0-1.153-.462T6.5 15.385V4.615q0-.69.463-1.153T8.116 3h10.769q.69 0 1.153.462t.462 1.153v10.77q0 .69-.462 1.152T18.884 17zm-3 3q-.69 0-1.153-.462T3.5 18.385V6.615h1v11.77q0 .23.192.423t.423.192h11.77v1zM7.5 4v12z"/></svg>',
    caret: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m7.4 8.6 4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4Z"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.7 7.6 1 12a11.8 11.8 0 0 0 22 0c-1.7-4.4-6-7.5-11-7.5Z"/></svg>',
};

const initAccordionToolbar = (component, options) => {
    const { toolbarIconOpen = ICONS.eye } = options;
    const accordionComponent = component.is(ACCORDION_TYPE) ? component : component.closestType(ACCORDION_TYPE);

    if (!toolbarIconOpen || !accordionComponent) return;

    const { toolbar } = component;
    const toggleButton = {
        id: "accordion-toggle-open",
        label: toolbarIconOpen,
        command: () => accordionComponent.toggleOpen(),
    };

    if (!toolbar.find((item) => item.id === toggleButton.id)) {
        toolbar?.unshift(toggleButton);
    }
};

const createAccordionComponent = (editor, options) => {
    const { Components, Blocks } = editor;
    const { block = {} } = options;

    const componentName = "Accordion";
    const componentClass = `${PLUGIN_PREFIX}${ACCORDION_TYPE}`;

    const accordionScript = function (scriptOptions = {}) {
        const accordionElement = this;

        const updateMarkerState = () => {
            const { clsMarkerOpen, selector } = scriptOptions;
            const marker = accordionElement.querySelector(selector);
            if (!marker || !clsMarkerOpen) return;
            accordionElement.open ? marker.classList.add(clsMarkerOpen) : marker.classList.remove(clsMarkerOpen);
        };

        accordionElement.addEventListener("toggle", () => {
            updateMarkerState();
            accordionElement.dispatchEvent(new CustomEvent("details-toggle", { bubbles: true }));
        });

        updateMarkerState();
    };

    Components.addType(ACCORDION_TYPE, {
        block: block && {
            label: componentName,
            media: ICONS.accordion,
            category: BLOCKS_CATEGORY,
            select: true,
            ...block,
        },
        isComponent: isComponentOfType(ACCORDION_TYPE),
        extendFn: ["initToolbar"],
        model: {
            defaults: {
                tagName: "details",
                name: componentName,
                classes: componentClass,
                emptyState: true,
                clsMarkerOpen: ACCORDION_MARKER_OPEN_CLASS,
                selector: `[${DATA_TYPE_ATTR}="${ACCORDION_MARKER_TYPE}"]`,
                attributes: injectComponentType(ACCORDION_TYPE),
                droppable: isOneOfTypes(ACCORDION_HEADER_TYPE, ACCORDION_CONTENT_TYPE),
                components: [{ type: ACCORDION_HEADER_TYPE }, { type: ACCORDION_CONTENT_TYPE }],
                "script-props": ["clsMarkerOpen", "selector"],
                script: accordionScript,
                traits: [{ type: "checkbox", name: "open", label: "Open" }],
                styles: `
                    .${componentClass}::details-content {
                        opacity: 0;
                        block-size: 0;
                        overflow: hidden;
                        transform: translateY(-5px);
                        transition-property: opacity, transform, block-size, content-visibility;
                        transition-behavior: normal, normal, normal, allow-discrete;
                        transition-timing-function: ease-in-out;
                        transition-duration: 0.2s;
                    }
                    .${componentClass}[open]::details-content {
                        opacity: 1;
                        transform: translateY(0);
                        block-size: auto;
                    }
                `,
            },
            toggleOpen() {
                this.addAttributes({ open: !this.getAttributes().open });
            },
            initToolbar() {
                initAccordionToolbar(this, options);
            },
        },
    });

    return () => {
        Blocks.remove(ACCORDION_TYPE);
        Components.removeType(ACCORDION_TYPE);
    };
};

const createAccordionContentComponent = (editor) => {
    const { Components } = editor;

    Components.addType(ACCORDION_CONTENT_TYPE, {
        isComponent: isComponentOfType(ACCORDION_CONTENT_TYPE),
        model: {
            defaults: {
                name: "Accordion Content",
                removable: false,
                copyable: false,
                draggable: false,
                emptyState: true,
                classes: ACCORDION_CONTENT_CLASS,
                attributes: injectComponentType(ACCORDION_CONTENT_TYPE),
                components: "<div>Accordion content</div>",
            },
        },
    });

    return () => Components.removeType(ACCORDION_CONTENT_TYPE);
};

const createAccordionGroupComponent = (editor, options) => {
    const { Components, Blocks } = editor;
    const { blockGroup = {} } = options;

    const componentName = "Accordion Group";

    const accordionGroupScript = function (scriptOptions = {}) {
        const { single, accordionSelector } = scriptOptions;
        if (!single) return;

        const groupElement = this;

        groupElement.addEventListener("details-toggle", (event) => {
            const targetAccordion = event.target;
            if (!single || !targetAccordion || !targetAccordion.open) return;

            groupElement.querySelectorAll(accordionSelector).forEach((accordion) => {
                if (targetAccordion !== accordion && accordion.open) {
                    accordion.open = false;
                }
            });
        });
    };

    const createAccordionItem = (itemOptions = {}) => ({
        type: ACCORDION_TYPE,
        attributes: { open: itemOptions.open },
        components: [
            {
                type: ACCORDION_HEADER_TYPE,
                components: [`<div>${itemOptions.header}</div>`, { type: ACCORDION_MARKER_TYPE }],
            },
            {
                type: ACCORDION_CONTENT_TYPE,
                components: `<div>${itemOptions.content}</div>`,
            },
        ],
    });

    Components.addType(ACCORDION_GROUP_TYPE, {
        block: blockGroup && {
            label: componentName,
            media: ICONS.accordionGroup,
            category: BLOCKS_CATEGORY,
            select: true,
            ...blockGroup,
        },
        isComponent: isComponentOfType(ACCORDION_GROUP_TYPE),
        model: {
            defaults: {
                name: componentName,
                attributes: injectComponentType(ACCORDION_GROUP_TYPE),
                droppable: isOneOfTypes(ACCORDION_TYPE),
                single: true,
                accordionSelector: `[${DATA_TYPE_ATTR}="${ACCORDION_TYPE}"]`,
                emptyState: true,
                components: Array(3)
                    .fill(0)
                    .map((_, index) =>
                        createAccordionItem({
                            open: index === 0,
                            header: `Accordion header ${index + 1}`,
                            content: `Accordion content ${index + 1}`,
                        }),
                    ),
                traits: [
                    {
                        type: "checkbox",
                        name: "single",
                        changeProp: true,
                        tip: "Only one accordion can be open at a time",
                        label: "Single open",
                    },
                ],
                "script-props": ["single", "accordionSelector"],
                script: accordionGroupScript,
            },
        },
    });

    return () => {
        Blocks.remove(ACCORDION_GROUP_TYPE);
        Components.removeType(ACCORDION_GROUP_TYPE);
    };
};

const createAccordionHeaderComponent = (editor, options) => {
    const { Components } = editor;

    Components.addType(ACCORDION_HEADER_TYPE, {
        isComponent: isComponentOfType(ACCORDION_HEADER_TYPE),
        extendFn: ["initToolbar"],
        model: {
            defaults: {
                tagName: "summary",
                name: "Accordion Header",
                removable: false,
                copyable: false,
                draggable: false,
                emptyState: true,
                classes: ACCORDION_HEADER_CLASS,
                attributes: injectComponentType(ACCORDION_HEADER_TYPE),
                components: ["<div>Accordion header</div>", { type: ACCORDION_MARKER_TYPE }],
                styles: `
                    summary { list-style: none; }
                    .${ACCORDION_HEADER_CLASS} {
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                    }
                `,
            },
            initToolbar() {
                initAccordionToolbar(this, options);
            },
        },
    });

    return () => Components.removeType(ACCORDION_HEADER_TYPE);
};

const createAccordionMarkerComponent = (editor) => {
    const { Components } = editor;

    Components.addType(ACCORDION_MARKER_TYPE, {
        extend: "icon",
        isComponent: isComponentOfType(ACCORDION_MARKER_TYPE),
        model: {
            defaults: {
                name: "Accordion Marker",
                classes: ACCORDION_MARKER_CLASS,
                attributes: injectComponentType(ACCORDION_MARKER_TYPE),
                components: ICONS.caret,
                droppable: false,
                draggable: isChildOfTypes(ACCORDION_HEADER_TYPE),
                styles: `
                    .${ACCORDION_MARKER_CLASS} {
                        min-width: 24px;
                        width: 24px;
                        height: 24px;
                        transition: transform 0.2s ease-in-out;
                    }
                    .${ACCORDION_MARKER_OPEN_CLASS} {
                        transform: rotateZ(180deg);
                    }
                `,
            },
        },
    });

    return () => Components.removeType(ACCORDION_MARKER_TYPE);
};

export default (editor, options = {}) => {
    createAccordionComponent(editor, options);
    createAccordionGroupComponent(editor, options);
    createAccordionHeaderComponent(editor, options);
    createAccordionMarkerComponent(editor);
    createAccordionContentComponent(editor);

    editor.I18n.addMessages({
        fr: {
            blockManager: {
                labels: {
                    accordion: "Accordéon",
                    "accordion-group": "Groupe d'accordéons",
                },
            },
            domComponents: {
                names: {
                    Accordion: "Accordéon",
                    "Accordion Header": "En-tête d'accordéon",
                    "Accordion Content": "Contenu d'accordéon",
                    "Accordion Group": "Groupe d'accordéons",
                    "Accordion Marker": "Icône d'accordéon",
                },
            },
            traitManager: { traits: { labels: { open: "Ouvert" } } },
        },
    });
};
