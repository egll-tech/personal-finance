import { int, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { BudgetSchema } from './BudgetSchema.ts'
import { enumToSQLEnum } from './utils/enumToSQLEnum.ts'

export enum ExpenseSchemaStatus {
  PLANNED = 'planned',
  INITIATED = 'initiated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export const ExpenseSchema = sqliteTable('Expense', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text('status', {
    mode: 'text',
    enum: enumToSQLEnum(ExpenseSchemaStatus),
  }),
  plannedAmount: numeric().notNull(),
  actualAmount: numeric(),
  dueDate: int().notNull(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
  initiationDate: int(),
  completionDate: int(),
  cancelationDate: int(),

  budgetId: text().references(() => BudgetSchema.id, { onDelete: 'cascade' })
    .notNull(),
})
