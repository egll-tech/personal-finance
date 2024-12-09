import {
  int,
  numeric,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

/**
 * TODO: Research how to import `@personal-finance/api` enums. It will throw
 * MODULE_NOT_FOUND
 */

export const Budget = sqliteTable('Budget', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  startDate: int().notNull(),
  endDate: int().notNull(),
})

export const BudgetRelations = relations(Budget, ({ many }) => ({
  income: many(Income),
  expense: many(Expense),
}))

export const Income = sqliteTable('Income', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text({ enum: ['planned', 'completed'] })
    .notNull().default('planned'),
  plannedAmount: numeric().notNull(),
  actualAmount: numeric(),
  plannedPayDate: int().notNull(),
  actualPayDate: int(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
  completedAt: int(),
  budgetId: text().references(() => Budget.id, { onDelete: 'cascade' })
    .notNull(),
})

export const IncomeRelations = relations(Income, ({ one }) => ({
  budget: one(Budget, {
    fields: [Income.budgetId],
    references: [Budget.id],
  }),
}))

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
  dueDate: int().notNull(),
  initiationDate: int(),
  completionDate: int(),
  cancelationDate: int(),

  budgetId: text().references(() => Budget.id, { onDelete: 'cascade' })
    .notNull(),
})

export const ExpenseRelations = relations(Expense, ({ one, many }) => ({
  budget: one(Budget, {
    fields: [Expense.budgetId],
    references: [Budget.id],
  }),
  expenseToCategory: many(ExpenseToCategory),
}))

export const Category = sqliteTable('Category', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
})

export const CategoryRelations = relations(Category, ({ many }) => ({
  expenseToCategory: many(ExpenseToCategory),
}))

export const ExpenseToCategory = sqliteTable('ExpenseToCategory', {
  expenseId: text().notNull().references(() => Expense.id, {
    onDelete: 'cascade',
  }),
  categoryId: text().notNull().references(() => Category.id, {
    onDelete: 'cascade',
  }),
}, (table) => ({
  pk: primaryKey({ columns: [table.expenseId, table.categoryId] }),
}))
