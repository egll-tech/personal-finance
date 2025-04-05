import { int, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { BudgetSchema } from './BudgetSchema.ts'
import { enumToSQLEnum } from './utils/enumToSQLEnum.ts'

export enum IncomeSchemaStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

export const IncomeSchema = sqliteTable('Income', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  status: text('status', {
    mode: 'text',
    enum: enumToSQLEnum(IncomeSchemaStatus),
  })
    .notNull().default(
      IncomeSchemaStatus.PLANNED,
    ),
  plannedAmount: numeric().notNull(),
  actualAmount: numeric(),
  plannedPayDate: int({ mode: 'timestamp_ms' }).notNull(),
  actualPayDate: int({ mode: 'timestamp_ms' }),
  createdAt: int({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: int({ mode: 'timestamp_ms' }).notNull(),
  completedAt: int({ mode: 'timestamp_ms' }),
  budgetId: text().references(() => BudgetSchema.id, { onDelete: 'cascade' })
    .notNull(),
})
