import { after } from "@lib/api/patcher";
import { findInReactTree } from "@lib/utils";
import { TableRow } from "@metro/common/components";
import { findByNameLazy, findByPropsLazy } from "@metro/wrappers";
import { registeredSections } from "@ui/settings";

import { CustomPageRenderer, wrapOnPress } from "./shared";

const settingConstants = findByPropsLazy("SETTING_RENDERER_CONFIG");
const SettingsOverviewScreen = findByNameLazy("SettingsOverviewScreen", false);

function isSectionArray(value: any): value is any[] {
    return Array.isArray(value) && value.some(section => Array.isArray(section?.settings));
}

function findSettingsSections(tree: any): any[] | null {
    const reactSections = findInReactTree(tree, i => isSectionArray(i?.props?.sections))?.props?.sections;
    if (isSectionArray(reactSections)) return reactSections;

    const queue = [tree];
    const seen = new Set<object>();
    let scanned = 0;

    while (queue.length && scanned < 4000) {
        const node = queue.shift();
        scanned++;

        if (!node || typeof node !== "object") continue;

        if (Array.isArray(node)) {
            if (isSectionArray(node)) return node;
            node.forEach(item => queue.push(item));
            continue;
        }

        if (seen.has(node)) continue;
        seen.add(node);

        if (isSectionArray((node as any).sections)) return (node as any).sections;
        if (isSectionArray((node as any).props?.sections)) return (node as any).props.sections;

        Object.values(node).forEach(value => {
            if (value && typeof value === "object") queue.push(value);
        });
    }

    return null;
}

export function patchTabsUI(unpatches: (() => void | boolean)[]) {
    try {
        const getRows = () => Object.values(registeredSections)
            .flatMap(sect => sect.map(row => ({
                [row.key]: {
                    type: "pressable",
                    title: row.title,
                    icon: row.icon,
                    IconComponent: () => <TableRow.Icon source={row.icon} />,
                    usePredicate: row.usePredicate,
                    useTrailing: row.useTrailing,
                    onPress: wrapOnPress(row.onPress, null, row.render, row.title()),
                    withArrow: true,
                    ...row.rawTabsConfig
                }
            })))
            .reduce((a, c) => Object.assign(a, c), {});

        const origRendererConfig = settingConstants.SETTING_RENDERER_CONFIG;
        let rendererConfigValue = settingConstants.SETTING_RENDERER_CONFIG;

        Object.defineProperty(settingConstants, "SETTING_RENDERER_CONFIG", {
            enumerable: true,
            configurable: true,
            get: () => ({
                ...rendererConfigValue,
                DISSONANCE_CUSTOM_PAGE: {
                    type: "route",
                    title: () => "Dissonance",
                    screen: {
                        route: "DISSONANCE_CUSTOM_PAGE",
                        getComponent: () => CustomPageRenderer
                    }
                },
                ...getRows()
            }),
            set: v => rendererConfigValue = v,
        });

        unpatches.push(() => {
            Object.defineProperty(settingConstants, "SETTING_RENDERER_CONFIG", {
                value: origRendererConfig,
                writable: true,
                get: undefined,
                set: undefined
            });
        });

        unpatches.push(after("default", SettingsOverviewScreen, (_, ret) => {
            const sections = findSettingsSections(ret);
            if (!sections) return;

            const sectionNames = Object.keys(registeredSections).filter(name => registeredSections[name].length > 0);
            if (!sectionNames.length) return;

            const accountIndex = sections.findIndex((i: any) => Array.isArray(i?.settings) && i.settings.includes("ACCOUNT"));
            let insertIndex = accountIndex === -1 ? Math.min(1, sections.length) : accountIndex + 1;

            sectionNames.forEach(sectionName => {
                const keys = registeredSections[sectionName].map(row => row.key);
                const existing = sections.find((s: any) => s?.label === sectionName || s?.title === sectionName);

                if (existing) {
                    if (!Array.isArray(existing.settings)) existing.settings = [];
                    keys.forEach(key => !existing.settings.includes(key) && existing.settings.push(key));
                    return;
                }

                sections.splice(insertIndex++, 0, {
                    label: sectionName,
                    title: sectionName,
                    settings: keys
                });
            });

            const fallbackSection = sections.find((s: any) => Array.isArray(s?.settings) && s.settings.includes("ACCOUNT"))
                ?? sections.find((s: any) => Array.isArray(s?.settings));

            if (!fallbackSection) return;

            sectionNames
                .flatMap(name => registeredSections[name].map(row => row.key))
                .forEach(key => {
                    const exists = sections.some((s: any) => Array.isArray(s?.settings) && s.settings.includes(key));
                    if (!exists) fallbackSection.settings.push(key);
                });
        }));
    } catch { }
}
