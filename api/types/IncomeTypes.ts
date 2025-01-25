import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { IncomeSchema, IncomeSchemaStatus } from '../database/mod.ts'
import { currencyZod } from './shared.ts'

export type SelectIncomeSchemaType = typeof IncomeSchema.$inferSelect

export const InsertIncomeSchemaParser = createInsertSchema(IncomeSchema, {
  id: z.string().optional(),
  createdAt: z.date().optional(),
})

export const CompletedIncomeSchemaParser = createUpdateSchema(IncomeSchema, {
  id: z.string(),
  status: z.literal(IncomeSchemaStatus.COMPLETED),
  completedAt: z.date(),
  actualAmount: currencyZod,
  actualPayDate: z.date(),
  plannedPayDate: z.date(),
})

export const PlannedIncomeSchemaParser = createUpdateSchema(IncomeSchema, {
  status: z.literal(IncomeSchemaStatus.PLANNED),
  plannedAmount: currencyZod,
  actualAmount: z.string().optional(),
  plannedPayDate: z.date(),
  actualPayDate: z.date().optional(),
  completedAt: z.date().optional(),
})

export type InsertIncomeSchemaType = z.TypeOf<typeof InsertIncomeSchemaParser>
export type CompletedIncomeSchemaType = z.TypeOf<
  typeof CompletedIncomeSchemaParser
>
export type PlannedIncomeSchemaType = z.TypeOf<typeof PlannedIncomeSchemaParser>

export { IncomeSchemaStatus } from '../database/mod.ts'
