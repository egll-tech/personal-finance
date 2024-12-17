import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { CategorySchema } from './CategorySchema.ts'
import { ExpenseSchema } from './ExpenseSchema.ts'

export const ExpenseToCategorySchema = sqliteTable('ExpenseToCategory', {
  expenseId: text().notNull().references(() => ExpenseSchema.id, {
    onDelete: 'cascade',
  }),
  categoryId: text().notNull().references(() => CategorySchema.id, {
    onDelete: 'cascade',
  }),
}, (table) => ({
  pk: primaryKey({ columns: [table.expenseId, table.categoryId] }),
}))
