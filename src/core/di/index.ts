export class Container {
    private static instance: Container;
    private services = new Map<string, any>();
    private singletons = new Map<string, any>();

    private constructor() { }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    /**
     * Register a singleton instance.
     * The instance is created once and reused.
     */
    registerSingleton<T>(key: string, instance: T) {
        this.singletons.set(key, instance);
    }

    /**
     * Register a class constructor as a singleton.
     * The instance will be created on the first resolve.
     */
    registerSingletonClass<T>(key: string, constructor: new (...args: any[]) => T, dependencies: string[] = []) {
        this.services.set(key, { type: 'singleton', constructor, dependencies, instance: null });
    }

    /**
     * Register a transient class.
     * A new instance is created every time it is resolved.
     */
    registerTransient<T>(key: string, constructor: new (...args: any[]) => T, dependencies: string[] = []) {
        this.services.set(key, { type: 'transient', constructor, dependencies });
    }

    /**
     * Resolve a dependency.
     */
    resolve<T>(key: string): T {
        // 1. Check if it's a pre-registered instance
        if (this.singletons.has(key)) {
            return this.singletons.get(key);
        }

        // 2. Check service definitions
        const definition = this.services.get(key);
        if (!definition) {
            throw new Error(`Service '${key}' not registered in Container.`);
        }

        if (definition.type === 'singleton') {
            if (definition.instance) {
                return definition.instance;
            }
            const instance = this.createInstance(definition.constructor, definition.dependencies);
            definition.instance = instance;
            return instance;
        }

        return this.createInstance(definition.constructor, definition.dependencies);
    }

    private createInstance(constructor: new (...args: any[]) => any, depKeys: string[]) {
        if (!depKeys || depKeys.length === 0) {
            return new constructor();
        }
        const args = depKeys.map(k => this.resolve(k));
        return new constructor(...args);
    }
}

export const container = Container.getInstance();
