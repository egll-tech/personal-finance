import { numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * TODO: Research how to import `@personal-finance/api` enums. It will throw
 * MODULE_NOT_FOUND
 */

export const Budget = sqliteTable('Budget', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  startDate: numeric().notNull(),
  endDate: numeric().notNull(),
})

export const BudgetItem = sqliteTable('BudgetItem', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  type: text({
    enum: [
      'expense',
      'income',
    ],
  }).notNull(),
  budget: text().references(() => Budget.id, { onDelete: 'restrict' }),
})

export const Income = sqliteTable('Income', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text({ enum: ['planned', 'completed'] })
    .notNull().default('planned'),
  plannedAmount: numeric().notNull(),
  actualAmount: numeric(),
  plannedPayDate: numeric().notNull(),
  actualPayDate: numeric(),

  budgetItem: text().notNull().references(() => BudgetItem.id, {
    onDelete: 'cascade',
  }),
})

export const Expense = sqliteTable('Expense', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text({
    enum: [
      'planned',
      'initiated',
      'completed',
      'cancelled',
      'failed',
    ],
  }).notNull()
    .default('planned'),
  plannedAmount: numeric().notNull(),
  actualAmount: numeric(),
  dueDate: numeric().notNull(),
  initiationDate: numeric(),
  completionDate: numeric(),
  cancelationDate: numeric(),

  budgetItem: text().notNull().references(() => BudgetItem.id, {
    onDelete: 'cascade',
  }),

  categories: text({ mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
})

export const Category = sqliteTable('Category', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
})
