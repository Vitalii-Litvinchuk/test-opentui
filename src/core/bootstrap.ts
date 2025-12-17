import { Glob } from "bun";

export async function bootstrapApplication() {
    const glob = new Glob("**/register.ts");

    const scanner = glob.scan({
        cwd: "./src/core",
        absolute: true,
        onlyFiles: true
    });

    for await (const file of scanner) {
        console.log(`[Bootstrap] Loading registration file: ${file}`);
        try {
            const module = await import(file);

            for (const key in module) {
                if (key.startsWith("register") && key.endsWith("Handlers")) {
                    const fn = module[key];
                    if (typeof fn === "function") {
                        console.log(`[Bootstrap] Invoking: ${key}`);
                        fn();
                    }
                }
            }
        } catch (e) {
            console.error(`[Bootstrap] Failed to load ${file}:`, e);
        }
    }
}
