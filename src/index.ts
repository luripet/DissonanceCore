import patchErrorBoundary from "@core/debug/patches/patchErrorBoundary";
import { initDissonanceObject } from "@core/dissonance/api";
import { VdPluginManager } from "@core/dissonance/plugins";
import initFixes from "@core/fixes";
import { initFetchI18nStrings } from "@core/i18n";
import initSettings from "@core/ui/settings";
import { updateFonts } from "@lib/addons/fonts";
import { initPlugins, updatePlugins } from "@lib/addons/plugins";
import { initThemes } from "@lib/addons/themes";
import { patchCommands } from "@lib/api/commands";
import { patchLogHook } from "@lib/api/debug";
import { injectFluxInterceptor } from "@lib/api/flux";
import { patchJsx } from "@lib/api/react/jsx";
import { logger } from "@lib/utils/logger";
import { patchSettings } from "@ui/settings";

import * as lib from "./lib";

export default async () => {
    // Load everything in parallel
    await Promise.all([
        initThemes(),
        injectFluxInterceptor(),
        patchSettings(),
        patchLogHook(),
        patchCommands(),
        patchJsx(),
        initDissonanceObject(),
        initFetchI18nStrings(),
        initSettings(),
        initFixes(),
        patchErrorBoundary(),
        updatePlugins()
    ]).then(
        // Push them all to unloader
        u => u.forEach(f => f && lib.unload.push(f))
    );

    // Assign window object
    window.dissonance = lib;

    // Once done, load Dissonance plugins
    VdPluginManager.initPlugins()
        .then(u => lib.unload.push(u))
        .catch(() => alert("Failed to initialize Dissonance plugins"));

    // And then, load Dissonance plugins
    initPlugins();

    // Update the fonts
    updateFonts();

    // We good :)
    logger.log("Dissonance is ready!");
};
