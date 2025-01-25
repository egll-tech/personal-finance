import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { ExpenseSchema, ExpenseSchemaStatus } from '../database/mod.ts'
import { currencyZod } from './shared.ts'

export type SelectExpenseSchemaType = typeof ExpenseSchema.$inferSelect

export const InsertExpenseSchemaParser = createInsertSchema(ExpenseSchema, {
  id: z.string().optional(),
  createdAt: z.date().optional(),
})

export const InitiatedExpenseSchemaParser = createUpdateSchema(ExpenseSchema, {
  id: z.string(),
  status: z.literal(ExpenseSchemaStatus.INITIATED),
  initiationDate: z.date(),
  actualAmount: currencyZod,
})

export const CompletedExpenseSchemaParser = createUpdateSchema(ExpenseSchema, {
  id: z.string(),
  status: z.literal(ExpenseSchemaStatus.COMPLETED),
  completionDate: z.date(),
  actualAmount: currencyZod,
})

export const CancelledExpenseSchemaParser = createUpdateSchema(ExpenseSchema, {
  id: z.string(),
  status: z.literal(ExpenseSchemaStatus.CANCELLED),
  cancelationDate: z.date(),
  actualAmount: z.coerce.number().pipe(z.literal(0)),
})

export type InsertExpenseSchemaType = z.TypeOf<typeof InsertExpenseSchemaParser>
export type InitiatedExpenseSchemaType = z.TypeOf<
  typeof InitiatedExpenseSchemaParser
>
export type CompletedExpenseSchemaType = z.TypeOf<
  typeof CompletedExpenseSchemaParser
>
export type CancelledExpenseSchemaType = z.TypeOf<
  typeof CancelledExpenseSchemaParser
>

export { ExpenseSchemaStatus } from '../database/mod.ts'
