import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./client";

async function runMigrations() {
    console.log('⏳ Running migrations...');

    try {
        await migrate(db, { migrationsFolder: "./src/core/db/drizzle" });
        console.log('✅ Migrations completed successfully');
    } catch (err) {
        console.error('❌ Migration failed');
        console.error(err);
        process.exit(1);
    }
}

runMigrations();
