import { usePlugin } from "grapesjs";

import pluginPresetWebpage from "grapesjs-preset-webpage";
import pluginBlocksBasic from "grapesjs-blocks-basic";
import pluginCountdown from "grapesjs-component-countdown";
import pluginCustomCode from "grapesjs-custom-code";

import pluginInitCategories from "./plugins/initCategories.js";
import pluginReorganizeBlocks from "./plugins/reorganizeBlocks.js";
import pluginBlockTitle from "./plugins/blockTitle.js";
import pluginBlockList from "./plugins/blockList.js";
import pluginBlockAccordion from "./plugins/blockAccordion.js";
import pluginBlockSection from "./plugins/blockSection.js";
import pluginBlockDivider from "./plugins/blockDivider.js";
import pluginBlockIcon from "./plugins/blockIcon.js";
import pluginTable from "./plugins/table/index.js";
import pluginFormStorage from "./plugins/formStorage.js";
import pluginButtonSave from "./plugins/buttonSave.js";
import pluginAssetManagerUpload from "./plugins/assetManagerUpload.js";
import pluginTraitSelectApi from "./plugins/traitSelectApi.js";
import pluginTraitSelectIcon from "./plugins/traitSelectIcon.js";

/**
 * Plugin registry for the editor. Register plugins, then select and order the active ones.
 * "pb:init-categories" must always be activated first so block categories keep their order.
 */
export class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.activePlugins = [];
        this.preloadDefaultPlugins();
    }

    preloadDefaultPlugins() {
        this.registerPlugin("pb:init-categories", pluginInitCategories, { categories: ["Basic", "Layout", "Advanced"] });
        this.registerPlugin("pb:title", pluginBlockTitle);
        this.registerPlugin("pb:section", pluginBlockSection);
        this.registerPlugin("grapesjs:blocks-basic", pluginBlocksBasic, {
            blocks: ["column1", "column2", "column3", "column3-7", "text", "link", "image", "video", "map"],
            flexGrid: true,
        });
        this.registerPlugin("grapesjs:preset-webpage", pluginPresetWebpage, {
            blocks: ["link-block", "quote", "text-basic"],
            useCustomTheme: false,
        });
        this.registerPlugin("pb:list", pluginBlockList);
        this.registerPlugin("pb:divider", pluginBlockDivider);
        this.registerPlugin("pb:icon", pluginBlockIcon);
        this.registerPlugin("pb:accordion", pluginBlockAccordion);
        this.registerPlugin("grapesjs:custom-code", pluginCustomCode, { blockCustomCode: { category: "Advanced" } });
        this.registerPlugin("grapesjs:countdown", pluginCountdown, { block: { category: "Advanced" } });
        this.registerPlugin("pb:table", pluginTable);
        this.registerPlugin("pb:reorganize-blocks", pluginReorganizeBlocks, {
            blocks: [
                { id: "column1", category: "Layout" },
                { id: "column2", category: "Layout" },
                { id: "column3", category: "Layout" },
                { id: "column3-7", category: "Layout" },
            ],
        });
        this.registerPlugin("pb:form-storage", pluginFormStorage);
        this.registerPlugin("pb:button-save", pluginButtonSave);
        this.registerPlugin("pb:asset-manager-upload", pluginAssetManagerUpload);
        this.registerPlugin("pb:trait-select-api", pluginTraitSelectApi);
        this.registerPlugin("pb:trait-select-icon", pluginTraitSelectIcon);
    }

    registerPlugin(name, plugin, defaultOptions = {}) {
        this.plugins.set(name, { plugin, defaultOptions });
    }

    getAvailablePlugins() {
        return Array.from(this.plugins.keys());
    }

    initActivePlugins(pluginsConfig) {
        this.activePlugins = pluginsConfig.map((config) => {
            if (typeof config === "string") {
                return { name: config, options: {} };
            }
            return { name: config.name, options: config.options || {} };
        });
    }

    appendActivePlugin(name, options = {}) {
        this.activePlugins.push({ name, options });
    }

    getActivePlugins() {
        return this.activePlugins;
    }

    buildConfig() {
        return this.activePlugins
            .map(({ name, options }) => {
                const pluginData = this.plugins.get(name);
                if (!pluginData) {
                    console.warn(`Plugin "${name}" not found in plugin registry`);
                    return null;
                }
                const mergedOptions = { ...pluginData.defaultOptions, ...options };
                return usePlugin(pluginData.plugin, mergedOptions);
            })
            .filter(Boolean);
    }
}
