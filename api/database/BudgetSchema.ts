import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const BudgetSchema = sqliteTable('Budget', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  startDate: int().notNull(),
  endDate: int().notNull(),
})
