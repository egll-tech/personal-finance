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
  dueDate: int({ mode: 'timestamp_ms' }).notNull(),
  createdAt: int({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: int({ mode: 'timestamp_ms' }).notNull(),
  initiationDate: int({ mode: 'timestamp_ms' }),
  completionDate: int({ mode: 'timestamp_ms' }),
  cancelationDate: int({ mode: 'timestamp_ms' }),

  budgetId: text().references(() => BudgetSchema.id, { onDelete: 'cascade' })
    .notNull(),
})
