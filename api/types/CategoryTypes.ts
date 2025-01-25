import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { CategorySchema } from '../database/mod.ts'

export type SelectCategorySchemaType = typeof CategorySchema.$inferSelect

export const InsertCategorySchemaParser = createInsertSchema(CategorySchema, {
  id: z.string().optional(),
})

export type InsertCategorySchemaType = z.TypeOf<
  typeof InsertCategorySchemaParser
>
