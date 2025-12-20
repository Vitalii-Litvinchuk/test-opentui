import type { AppRoutes } from "./constants";

/**
 * Helper to convert CONSTANT_CASE to kebab-case
 */
const toKebabCase = (str: any) =>
    typeof str === 'string' ? str.toLowerCase().replace(/_/g, '-') : '';

const routeCache = new Map<string, any>();
const discoveredKeys = new Set<string>();
const keyToPath = new Map<string, string>();

/**
 * Creates a recursive proxy that behaves like a string but allows nested access.
 */
function createRouteProxy(path: string): any {
    if (routeCache.has(path)) return routeCache.get(path);

    // Use a String object so it has all string methods (toUpperCase, etc.)
    const s = new String(path);

    const proxy = new Proxy(s, {
        get(target, prop: string | symbol) {
            // Support symbol access
            if (typeof prop === 'symbol') return (target as any)[prop];

            // Accessing existing string properties/methods
            if (prop in target) {
                const val = (target as any)[prop];
                return typeof val === 'function' ? val.bind(target) : val;
            }

            // Fallback for common JS/React stuff
            if (prop === 'toJSON' || prop === 'then' || prop === 'constructor') {
                return (target as any)[prop];
            }

            // Nested path generation: Routes.TODO.ADD -> "todo/add"
            const segment = toKebabCase(prop);
            return createRouteProxy(path ? `${path}/${segment}` : segment);
        }
    });

    routeCache.set(path, proxy);
    return proxy;
}

/**
 * Dynamic Routes Proxy.
 * Initially empty, expands on access or via explicit registration.
 * Supports:
 * - Routes.HOME -> "home" (recursive auto-generation)
 * - Routes.TODO.ADD -> "todo/add"
 * - Routes[0] -> first discovered route path
 */
export const Routes = new Proxy({}, {
    get(target, prop: string | symbol) {
        if (typeof prop === 'symbol') return undefined;

        // Numeric index access (e.g. Routes[0])
        if (/^\d+$/.test(prop)) {
            const keys = Array.from(discoveredKeys);
            const key = keys[Number(prop)];
            const path = key ? keyToPath.get(key) : undefined;
            return path ? createRouteProxy(path) : undefined;
        }

        // Check if we have an explicit mapping
        if (keyToPath.has(prop)) {
            return createRouteProxy(keyToPath.get(prop)!);
        }

        // Auto-generate root segment
        const segment = toKebabCase(prop);
        return createRouteProxy(segment);
    },
    set(target, prop: string, value: string) {
        discoveredKeys.add(prop);
        keyToPath.set(prop, value);
        return true;
    },
    has(target, prop: string) {
        return keyToPath.has(prop);
    },
    ownKeys() {
        return Array.from(discoveredKeys);
    },
    getOwnPropertyDescriptor(target, prop) {
        return {
            enumerable: true,
            configurable: true,
            value: (target as any)[prop as string]
        };
    }
}) as AppRoutes & Record<string, any> & { [index: number]: string };

export type RoutePath = string;
