import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { BudgetSchema } from '../database/mod.ts'

export type SelectBudgetSchemaType = typeof BudgetSchema.$inferSelect

export const InsertBudgetSchemaParser = createInsertSchema(BudgetSchema, {
  id: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export type InsertBudgetSchemaType = z.TypeOf<typeof InsertBudgetSchemaParser>
