import { createStorage } from "@lib/api/storage";

interface DissonanceColorPreferencesStorage {
    selected: string | null;
    type?: "dark" | "light" | null;
    customBackground: "hidden" | null;
    per?: Record<string, { autoUpdate?: string; } | undefined>;
}

export const colorsPref = createStorage<DissonanceColorPreferencesStorage>(
    "themes/colors/preferences.json",
    {
        dflt: {
            selected: null,
            customBackground: null
        }
    }
);
