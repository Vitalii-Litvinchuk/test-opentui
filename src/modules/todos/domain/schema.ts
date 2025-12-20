import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { categories } from '../../categories/domain/schema';

export const todos = sqliteTable('todos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    content: text('content').notNull(),
    completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
    categoryId: integer('category_id').references(() => categories.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const todosRelations = relations(todos, ({ one }) => ({
    category: one(categories, {
        fields: [todos.categoryId],
        references: [categories.id],
    }),
}));

export type Todo = typeof todos.$inferSelect & { category?: any };
export type NewTodo = typeof todos.$inferInsert;

