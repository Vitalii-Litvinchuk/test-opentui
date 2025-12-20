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
     * Register a class constructor as scoped.
     * The instance will be created once per scope.
     */
    registerScopedClass<T>(key: string, constructor: new (...args: any[]) => T, dependencies: string[] = []) {
        this.services.set(key, { type: 'scoped', constructor, dependencies });
    }

    /**
     * Register a transient class.
     * A new instance is created every time it is resolved.
     */
    registerTransient<T>(key: string, constructor: new (...args: any[]) => T, dependencies: string[] = []) {
        this.services.set(key, { type: 'transient', constructor, dependencies });
    }

    /**
     * Create a new scope.
     */
    createScope(): Map<string, any> {
        return new Map<string, any>();
    }

    /**
     * Resolve a dependency.
     */
    resolve<T>(key: string, scope?: Map<string, any>): T {
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
            const instance = this.createInstance(definition.constructor, definition.dependencies, scope);
            definition.instance = instance;
            return instance;
        }

        if (definition.type === 'scoped') {
            if (!scope) {
                throw new Error(`Service '${key}' is scoped but no scope was provided.`);
            }
            if (scope.has(key)) {
                return scope.get(key);
            }
            const instance = this.createInstance(definition.constructor, definition.dependencies, scope);
            scope.set(key, instance);
            return instance;
        }

        return this.createInstance(definition.constructor, definition.dependencies, scope);
    }

    private createInstance(constructor: new (...args: any[]) => any, depKeys: string[], scope?: Map<string, any>) {
        if (!depKeys || depKeys.length === 0) {
            return new constructor();
        }
        const args = depKeys.map(k => this.resolve(k, scope));
        return new constructor(...args);
    }
}

export const container = Container.getInstance();
