const icons = {};

export const getFallbackIcon = () => icons["fallback"];

export const registerIcon = (name, svg, force = false) => {
    if (icons[name] && !force) {
        throw new Error(`Icon "${name}" is already registered. Use force=true to overwrite.`);
    }
    icons[name] = svg;
};

export const getIcon = (name, force = false) => {
    if (!icons[name] && !force) {
        throw new Error(`Icon "${name}" not found.`);
    }
    return icons[name] || getFallbackIcon();
};

export const listIcons = () => Object.keys(icons);

registerIcon(
    "fallback",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M15 6V4h-3v2H8V4H5v2H4c-.6 0-1 .4-1 1v8h14V7c0-.6-.4-1-1-1z"/></svg>`,
);

registerIcon(
    "block:list",
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M4.13 6.75a.38.38 0 1 1-.75 0 .38.38 0 0 1 .75 0m0 5.25a.38.38 0 1 1-.75 0 .38.38 0 0 1 .75 0m0 5.25a.38.38 0 1 1-.75 0 .38.38 0 0 1 .75 0"/></svg>`,
);
registerIcon(
    "block:icon",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3 7 7 .6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.6 9 9z"/></svg>`,
);

registerIcon("action:add", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>`);
registerIcon(
    "action:add:list",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2m3.5 0a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2zm.1 5a1.1 1.1 0 0 0 0 2.2h5.8a1.1 1.1 0 0 0 0-2.2zm-1.1 6a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1M3 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0m1 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10.5.55a1 1 0 0 1 1-1h2V13.5a1 1 0 1 1 2 0v2.05h2a1 1 0 1 1 0 2h-2v1.95a1 1 0 1 1-2 0v-1.95h-2a1 1 0 0 1-1-1"/></svg>`,
);
registerIcon(
    "action:settings",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53a7.77 7.77 0 0 0 0-1.97l2.11-1.63a.5.5 0 0 0 .12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1a7.25 7.25 0 0 0-1.69-.98l-.37-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64L4.57 11a7.77 7.77 0 0 0 0 1.97l-2.11 1.66a.5.5 0 0 0-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.37-2.65a7.28 7.28 0 0 0 1.69-.99l2.49 1.01a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64z"/></svg>`,
);
registerIcon(
    "action:edit",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.78 16.31 3 21l4.69-.78a3.96 3.96 0 0 0 2.15-1.1l10.58-10.6a1.98 1.98 0 0 0 0-2.8l-2.15-2.15a1.98 1.98 0 0 0-2.8 0L4.89 14.16a3.96 3.96 0 0 0-1.1 2.15M14 6l4 4"/></svg>`,
);
registerIcon(
    "action:save",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>`,
);

registerIcon(
    "generic:star",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3 7 7 .6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.6 9 9z"/></svg>`,
);
registerIcon(
    "generic:heart",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
);
registerIcon(
    "generic:check",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
);
