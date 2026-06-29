/**
 * Wire the GrapesJS asset manager to the host image endpoints.
 *
 * options.endpoints.uploadImage  POST multipart, field "files", expects { data: [asset...] }
 * options.endpoints.listImages   GET ?context=...               expects { data: [asset...] }
 *                                 DELETE {listImages}/{assetId}
 * options.context                opaque identifier forwarded to the endpoints
 */
export default (editor, options = {}) => {
    const uploadEndpoint = options.endpoints?.uploadImage;
    const listEndpoint = options.endpoints?.listImages;
    const context = options.context || null;

    if (!uploadEndpoint) {
        console.warn("assetManagerUpload plugin: no uploadImage endpoint configured");
        return;
    }

    const assetManager = editor.AssetManager;
    const config = assetManager.getConfig();
    config.upload = uploadEndpoint;
    config.uploadName = "files";
    config.multiUpload = true;
    config.autoAdd = true;
    config.credentials = "same-origin";
    config.showUrlInput = false;
    config.headers = {};

    if (context) {
        config.params = { context };
    }

    const loadExistingAssets = async () => {
        if (!context || !listEndpoint) return;

        try {
            const url = `${listEndpoint}?context=${encodeURIComponent(context)}`;
            const response = await fetch(url, {
                method: "GET",
                credentials: "same-origin",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (Array.isArray(result.data)) {
                assetManager.add(result.data);
            }
        } catch (error) {
            console.error("assetManagerUpload plugin: failed to load existing assets", error);
        }
    };

    const deleteAsset = async (asset) => {
        const assetId = asset.get("id");
        if (!assetId || !listEndpoint) return;

        try {
            const response = await fetch(`${listEndpoint}/${assetId}`, {
                method: "DELETE",
                credentials: "same-origin",
            });
            if (!response.ok && response.status !== 204) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const assetSrc = normalizeUrl(asset.get("src"));
            editor
                .getWrapper()
                .findType("image")
                .forEach((img) => {
                    if (normalizeUrl(img.get("src")) === assetSrc) {
                        img.set("src", "");
                    }
                });
        } catch (error) {
            console.error("assetManagerUpload plugin: failed to delete asset", error);
        }
    };

    editor.on("load", loadExistingAssets);
    editor.on("asset:remove", deleteAsset);
    editor.on("asset:upload:error", (error) => {
        console.error("assetManagerUpload plugin: upload error", error);
        window.dispatchEvent(
            new CustomEvent("toast:add", {
                bubbles: true,
                detail: { message: "Upload failed. Please try again.", type: "error" },
            }),
        );
    });
};

function normalizeUrl(url) {
    try {
        return new URL(url).href;
    } catch {
        return url;
    }
}
