import { DissonanceManifest } from "@lib/addons/types";
import { createStorage } from "@lib/api/storage";
import { Logger } from "@lib/utils/logger";

export type PluginRepo = Record<string, {
    version: string;
    // For plugin developing convenience, plugins with this on will always get fetched
    alwaysFetch?: boolean;
}> & {
    $meta: {
        name: string;
        description: string;
    };
};

export interface PluginRepoStorage {
    [repoUrl: string]: PluginRepo;
}

export interface PluginSettingsStorage {
    [pluginId: string]: {
        enabled: boolean;
    };
}

export interface DissonancePluginManifest extends DissonanceManifest {
    readonly type: "plugin";
    readonly spec: 3;
    readonly main: string;
}

export interface DissonancePluginManifestInternal extends DissonancePluginManifest {
    readonly parentRepository: string;
    readonly jsPath?: string;
}

export interface PluginInstance {
    start?(): void;
    stop?(): void;
    SettingsComponent?(): JSX.Element;
}

export interface PluginInstanceInternal extends PluginInstance {
    readonly manifest: DissonancePluginManifest;
}

export interface DissonancePluginProperty {
    readonly manifest: DissonancePluginManifestInternal;
    readonly logger: Logger;
    createStorage<T extends object>(): ReturnType<typeof createStorage<T>>;
}

export type DissonancePluginObject = typeof window.dissonance & {
    plugin: DissonancePluginProperty;
};
