import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { ExpenseToCategorySchema } from '../database/mod.ts'

export type SelectExpenseToCategorySchemaType =
  typeof ExpenseToCategorySchema.$inferSelect

export const InsertExpenseToCategorySchemaParser = createInsertSchema(
  ExpenseToCategorySchema,
)

export type InsertExpenseToCategorySchemaType = z.TypeOf<
  typeof InsertExpenseToCategorySchemaParser
>
