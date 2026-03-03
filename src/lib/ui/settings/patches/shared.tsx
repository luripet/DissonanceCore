import { NavigationNative } from "@metro/common";
import { findByPropsLazy } from "@metro/wrappers";
import { ErrorBoundary } from "@ui/components";
import { RowConfig } from "@ui/settings";

const tabsNavigationRef = findByPropsLazy("getRootNavigationRef");

export const CustomPageRenderer = React.memo(() => {
    const navigation = NavigationNative.useNavigation();
    const route = NavigationNative.useRoute();

    const { render: PageComponent, noErrorBoundary, ...args } = route.params ?? {};

    React.useEffect(() => void navigation.setOptions({ ...args }), []);

    if (typeof PageComponent !== "function") return null;

    const content = <PageComponent />;
    return noErrorBoundary ? content : <ErrorBoundary>{content}</ErrorBoundary>;
});

export function wrapOnPress(
    onPress: (() => unknown) | undefined,
    navigation?: any,
    renderPromise?: RowConfig["render"],
    screenOptions?: string | Record<string, any>,
    props?: any,
) {
    return async () => {
        if (onPress) return void onPress();

        const Component = await renderPromise!!().then(m => m.default);

        if (typeof screenOptions === "string") {
            screenOptions = { title: screenOptions };
        }

        navigation ??= tabsNavigationRef.getRootNavigationRef();
        navigation.navigate("DISSONANCE_CUSTOM_PAGE", {
            ...screenOptions,
            render: () => <Component {...props} />
        });
    };
}
