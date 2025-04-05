import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { IncomeSchema, IncomeSchemaStatus } from '../database/mod.ts'
import { currencyZod } from './shared.ts'

export type SelectIncomeSchemaType = typeof IncomeSchema.$inferSelect

export const InsertIncomeSchemaParser = createInsertSchema(IncomeSchema, {
  id: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  actualPayDate: z.string().datetime().optional(),
})

export const CompletedIncomeSchemaParser = createUpdateSchema(IncomeSchema, {
  id: z.string(),
  status: z.literal(IncomeSchemaStatus.COMPLETED),
  completedAt: z.string().datetime(),
  actualAmount: currencyZod,
  actualPayDate: z.string().datetime(),
  plannedPayDate: z.string().datetime(),
})

export const PlannedIncomeSchemaParser = createUpdateSchema(IncomeSchema, {
  status: z.literal(IncomeSchemaStatus.PLANNED),
  plannedAmount: currencyZod,
  actualAmount: z.string().optional(),
  plannedPayDate: z.string().datetime(),
  actualPayDate: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
})

export type InsertIncomeSchemaType = z.TypeOf<typeof InsertIncomeSchemaParser>
export type CompletedIncomeSchemaType = z.TypeOf<
  typeof CompletedIncomeSchemaParser
>
export type PlannedIncomeSchemaType = z.TypeOf<typeof PlannedIncomeSchemaParser>
