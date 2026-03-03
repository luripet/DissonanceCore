import { VdThemeInfo } from "@lib/addons/themes";

// @ts-ignore
const pyonLoaderIdentity = globalThis.__PYON_LOADER__;
// @ts-ignore
const dissonanceLoaderIdentity = globalThis.__dissonance_loader;

export interface DissonanceLoaderIdentity {
    name: string;
    features: {
        loaderConfig?: boolean;
        devtools?: {
            prop: string;
            version: string;
        },
        themes?: {
            prop: string;
        };
    };
}

export function isDissonanceLoader() {
    return dissonanceLoaderIdentity != null;
}

export function isPyonLoader() {
    return pyonLoaderIdentity != null;
}

function polyfillDissonanceLoaderIdentity() {
    if (!isPyonLoader() || isDissonanceLoader()) return null;

    const loader = {
        name: pyonLoaderIdentity.loaderName,
        features: {} as Record<string, any>
    };

    if (isLoaderConfigSupported()) loader.features.loaderConfig = true;
    if (isSysColorsSupported()) {
        loader.features.syscolors = {
            prop: "__dissonance_syscolors"
        };

        Object.defineProperty(globalThis, "__dissonance_syscolors", {
            get: () => getSysColors(),
            configurable: true
        });
    }
    if (isThemeSupported()) {
        loader.features.themes = {
            prop: "__dissonance_theme"
        };

        Object.defineProperty(globalThis, "__dissonance_theme", {
            // get: () => getStoredTheme(),
            get: () => {
                // PyonXposed only returns keys it parses, making custom keys like Themes+' to gone
                const id = getStoredTheme()?.id;
                if (!id) return null;

                const { themes } = require("@lib/addons/themes");
                return themes[id] ?? getStoredTheme() ?? null;
            },
            configurable: true
        });
    }

    Object.defineProperty(globalThis, "__dissonance_loader", {
        get: () => loader,
        configurable: true
    });

    return loader as DissonanceLoaderIdentity;
}

export function getLoaderIdentity() {
    if (isPyonLoader()) {
        return pyonLoaderIdentity;
    } else if (isDissonanceLoader()) {
        return getDissonanceLoaderIdentity();
    }

    return null;
}

export function getDissonanceLoaderIdentity(): DissonanceLoaderIdentity | null {
    // @ts-ignore
    if (globalThis.__dissonance_loader) return globalThis.__dissonance_loader;
    return polyfillDissonanceLoaderIdentity();
}

// add to __dissonance_loader anyway
getDissonanceLoaderIdentity();

export function getLoaderName() {
    if (isPyonLoader()) return pyonLoaderIdentity.loaderName;
    else if (isDissonanceLoader()) return dissonanceLoaderIdentity.name;

    return "Unknown";
}

export function getLoaderVersion(): string | null {
    if (isPyonLoader()) return pyonLoaderIdentity.loaderVersion;
    return null;
}

export function isLoaderConfigSupported() {
    if (isPyonLoader()) {
        return true;
    } else if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.loaderConfig;
    }

    return false;
}

export function isThemeSupported() {
    if (isPyonLoader()) {
        return pyonLoaderIdentity.hasThemeSupport;
    } else if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.themes != null;
    }

    return false;
}

export function getStoredTheme(): VdThemeInfo | null {
    if (isPyonLoader()) {
        return pyonLoaderIdentity.storedTheme;
    } else if (isDissonanceLoader()) {
        const themeProp = dissonanceLoaderIdentity!!.features.themes?.prop;
        if (!themeProp) return null;
        // @ts-ignore
        return globalThis[themeProp] || null;
    }

    return null;
}

export function getThemeFilePath() {
    if (isPyonLoader()) {
        return "dissonance/current-theme.json";
    } else if (isDissonanceLoader()) {
        return "dissonance_theme.json";
    }

    return null;
}

export function isReactDevToolsPreloaded() {
    if (isPyonLoader()) {
        return Boolean(window.__reactDevTools);
    }
    if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.devtools != null;
    }

    return false;
}

export function getReactDevToolsProp(): string | null {
    if (!isReactDevToolsPreloaded()) return null;

    if (isPyonLoader()) {
        window.__dissonance_rdt = window.__reactDevTools.exports;
        return "__dissonance_rdt";
    }

    if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.devtools!!.prop;
    }

    return null;
}

export function getReactDevToolsVersion() {
    if (!isReactDevToolsPreloaded()) return null;

    if (isPyonLoader()) {
        return window.__reactDevTools.version || null;
    }
    if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.devtools!!.version;
    }

    return null;
}

export function isSysColorsSupported() {
    if (isPyonLoader()) return pyonLoaderIdentity.isSysColorsSupported;
    else if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.syscolors != null;
    }

    return false;
}

export function getSysColors() {
    if (!isSysColorsSupported()) return null;
    if (isPyonLoader()) {
        return pyonLoaderIdentity.sysColors;
    } else if (isDissonanceLoader()) {
        return dissonanceLoaderIdentity!!.features.syscolors!!.prop;
    }

    return null;
}

export function getLoaderConfigPath() {
    if (isPyonLoader()) {
        return "dissonance/loader.json";
    } else if (isDissonanceLoader()) {
        return "dissonance_loader.json";
    }

    return "loader.json";
}

export function isFontSupported() {
    if (isPyonLoader()) return pyonLoaderIdentity.fontPatch === 2;

    return false;
}
