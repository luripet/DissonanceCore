import { DissonancePlugin,VdPluginManager } from "@core/dissonance/plugins";
import { useProxy } from "@core/dissonance/storage";

import { UnifiedPluginModel } from ".";

export default function unifyDissonancePlugin(dissonancePlugin: DissonancePlugin): UnifiedPluginModel {
    return {
        id: dissonancePlugin.id,
        name: dissonancePlugin.manifest.name,
        description: dissonancePlugin.manifest.description,
        authors: dissonancePlugin.manifest.authors,
        icon: dissonancePlugin.manifest.dissonance?.icon,

        getBadges() {
            return [];
        },
        isEnabled: () => dissonancePlugin.enabled,
        isInstalled: () => Boolean(dissonancePlugin && VdPluginManager.plugins[dissonancePlugin.id]),
        usePluginState() {
            useProxy(VdPluginManager.plugins[dissonancePlugin.id]);
        },
        toggle(start: boolean) {
            start
                ? VdPluginManager.startPlugin(dissonancePlugin.id)
                : VdPluginManager.stopPlugin(dissonancePlugin.id);
        },
        resolveSheetComponent() {
            return import("../sheets/VdPluginInfoActionSheet");
        },
        getPluginSettingsComponent() {
            return VdPluginManager.getSettings(dissonancePlugin.id);
        },
    };
}
