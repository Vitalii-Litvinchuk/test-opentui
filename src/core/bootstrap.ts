import { Glob } from "bun";

export async function bootstrapApplication() {
    const glob = new Glob("**/register.{ts,tsx}");

    const scanner = glob.scan({
        cwd: "./src/modules",
        absolute: true,
        onlyFiles: true
    });

    const files = [];
    for await (const file of scanner) {
        files.push(file);
    }

    console.log(`[Bootstrap] Found ${files.length} registration files`);

    for (const file of files) {
        console.log(`[Bootstrap] Loading: ${file}`);
        try {
            const module = await import(file);

            for (const key in module) {
                if (key.startsWith("register") && key.endsWith("Handlers")) {
                    const fn = module[key];
                    if (typeof fn === "function") {
                        console.log(`[Bootstrap] Executing: ${key}`);
                        fn();
                    }
                }
            }
        } catch (e) {
            console.error(`[Bootstrap] Error in ${file}:`, e);
        }
    }
}
