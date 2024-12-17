import { int, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { BudgetSchema } from './BudgetSchema.ts'
import { createEnumMap } from './utils/createEnumMap.ts'

const _ExpenseStatusValues = [
  'planned',
  'initiated',
  'completed',
  'cancelled',
  'failed',
] as const

export const ExpenseSchemaStatus = createEnumMap(_ExpenseStatusValues)

export const ExpenseSchema = sqliteTable('Expense', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text({
    enum: _ExpenseStatusValues,
  }).notNull()
    .default(ExpenseSchemaStatus.PLANNED),
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
