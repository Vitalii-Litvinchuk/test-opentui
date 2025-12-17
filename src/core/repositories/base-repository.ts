import { db } from "../db/client";
import * as schema from "../db/schema";
import { eq, inArray } from "drizzle-orm";

type Schema = typeof schema;

/**
 * Base Repository providing 95% of common functionality:
 * - CRUD operations
 * - Support for retrieving by keys (single ID or array of IDs)
 * - Support for joins (relations) via 'with' option
 */
export abstract class BaseRepository<
    TSelect extends { id: number },
    TInsert extends Record<string, any>
> {
    constructor(
        protected readonly tableName: keyof Schema,
        protected readonly table: any // Using specific column types is complex, generic Table is sufficient for internal logic
    ) { }

    /**
     * Get all records with optional filtering and joins
     */
    async getAll(options?: {
        with?: any,
        where?: any,
        limit?: number,
        offset?: number,
        orderBy?: any
    }): Promise<TSelect[]> {
        return (db.query[this.tableName] as any).findMany(options) as Promise<TSelect[]>;
    }

    /**
     * Find a single record by ID with optional joins
     */
    async findById(id: number, options?: { with?: any }): Promise<TSelect | undefined> {
        return (db.query[this.tableName] as any).findFirst({
            where: eq(this.table.id, id),
            ...options
        }) as Promise<TSelect | undefined>;
    }

    /**
     * Find multiple records by IDs with optional joins
     * Supports keys(1, 2, 3) requirement
     */
    async findByIds(ids: number[], options?: { with?: any }): Promise<TSelect[]> {
        if (!ids.length) return [];
        return (db.query[this.tableName] as any).findMany({
            where: inArray(this.table.id, ids),
            ...options
        }) as Promise<TSelect[]>;
    }

    /**
     * Create a new record
     */
    async create(data: TInsert): Promise<TSelect> {
        const result = await db.insert(this.table).values(data).returning();
        const rows = result as unknown as TSelect[];
        if (!rows || rows.length === 0) throw new Error(`Failed to create record in ${String(this.tableName)}`);
        return rows[0]!;
    }

    /**
     * Update a record by ID
     */
    async update(id: number, data: Partial<TInsert>): Promise<TSelect | undefined> {
        const result = await db.update(this.table)
            .set(data)
            .where(eq(this.table.id, id))
            .returning();
        const rows = result as unknown as TSelect[];
        return rows[0];
    }

    /**
     * Delete a record by ID
     */
    async delete(id: number): Promise<void> {
        await db.delete(this.table).where(eq(this.table.id, id));
    }
}
