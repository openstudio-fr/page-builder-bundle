/**
 * Trait type "select-api": a select whose options are fetched from an endpoint.
 * Trait config: endpoint, valueKey (default "id"), labelKey (default "name"), itemDataKey.
 */
export default (editor) => {
    const tm = editor.TraitManager;

    tm.addType("select-api", {
        createInput({ trait }) {
            const el = document.createElement("select");
            el.classList.add("gjs-select");

            const endpoint = trait.get("endpoint");
            const valueKey = trait.get("valueKey") || "id";
            const labelKey = trait.get("labelKey") || "name";

            if (!endpoint) {
                const option = document.createElement("option");
                option.textContent = "Aucun endpoint défini";
                el.appendChild(option);
                el.disabled = true;
                return el;
            }

            const loadingOption = document.createElement("option");
            loadingOption.textContent = "Chargement...";
            el.appendChild(loadingOption);
            el.disabled = true;

            fetch(endpoint, { credentials: "same-origin" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!Array.isArray(data)) {
                        throw new Error("Expected an array of options");
                    }
                    el.innerHTML = "";

                    const emptyOption = document.createElement("option");
                    emptyOption.textContent = "-- Sélectionnez --";
                    emptyOption.value = "";
                    emptyOption.disabled = true;
                    emptyOption.selected = true;
                    el.appendChild(emptyOption);

                    data.forEach((item) => {
                        const option = document.createElement("option");
                        option.value = item[valueKey];
                        option.textContent = item[labelKey];
                        option.dataset.item = JSON.stringify(item);
                        el.appendChild(option);
                    });

                    el.disabled = false;

                    const currentValue = trait.get("value");
                    if (currentValue) {
                        el.value = currentValue;
                    }
                })
                .catch((error) => {
                    console.error("traitSelectApi plugin: error fetching options", error);
                    el.innerHTML = "<option>Error loading options</option>";
                    el.disabled = true;
                });

            return el;
        },

        onEvent({ elInput, component, trait }) {
            const name = trait.get("name");
            const labelKey = trait.get("labelKey") || "name";
            const changeProp = trait.get("changeProp");
            const itemDataKey = trait.get("itemDataKey");
            const selectedOption = elInput.options[elInput.selectedIndex];
            const labelValue = selectedOption ? selectedOption.textContent : "";

            if (changeProp) {
                component.set(name, elInput.value);
                return;
            }

            const attrs = { [name]: elInput.value, [labelKey]: labelValue };
            if (itemDataKey && selectedOption?.dataset.item) {
                attrs[itemDataKey] = selectedOption.dataset.item;
            }
            component.addAttributes(attrs);
        },
    });
};
