import DissonanceIcon from "@assets/icons/dissonance.png";
import { useProxy } from "@core/dissonance/storage";
import { Strings } from "@core/i18n";
import { findAssetId } from "@lib/api/assets";
import { isFontSupported, isThemeSupported } from "@lib/api/native/loader";
import { settings } from "@lib/api/settings";
import { registerSection } from "@ui/settings";
import { version } from "dissonance-build-info";

export { DissonanceIcon };

export default function initSettings() {
    registerSection({
        name: "Dissonance",
        items: [
            {
                key: "DISSONANCE",
                title: () => Strings.DISSONANCE,
                icon: { uri: DissonanceIcon },
                render: () => import("@core/ui/settings/pages/General"),
                useTrailing: () => `(${version})`
            },
            {
                key: "DISSONANCE_PLUGINS",
                title: () => Strings.PLUGINS,
                icon: findAssetId("ActivitiesIcon"),
                render: () => import("@core/ui/settings/pages/Plugins")
            },
            {
                key: "DISSONANCE_THEMES",
                title: () => Strings.THEMES,
                icon: findAssetId("PaintPaletteIcon"),
                render: () => import("@core/ui/settings/pages/Themes"),
                usePredicate: () => isThemeSupported()
            },
            {
                key: "DISSONANCE_FONTS",
                title: () => Strings.FONTS,
                icon: findAssetId("ic_add_text"),
                render: () => import("@core/ui/settings/pages/Fonts"),
                usePredicate: () => isFontSupported()
            },
            {
                key: "DISSONANCE_DEVELOPER",
                title: () => Strings.DEVELOPER,
                icon: findAssetId("WrenchIcon"),
                render: () => import("@core/ui/settings/pages/Developer"),
                usePredicate: () => useProxy(settings).developerSettings ?? false
            }
        ]
    });

    // Compat for plugins which injects into the settings
    // Flaw: in the old UI, this will be displayed anyway with no items
    registerSection({
        name: "DissonanceCompat",
        items: []
    });
}
