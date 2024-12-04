import { BudgetSchema, db } from '../db/index.ts'
import { generateId } from '../utils/generateId.ts'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'npm:zod'

/**
 * Overrides the DB schema, indicating which fields are optional for the
 * service.
 */
const InsertBudgetSchemaDB = createInsertSchema(BudgetSchema, {
  startDate: z.number().optional(),
  endDate: z.number().optional(),
})

/**
 * Schema from the DB. Objects should always match this.
 */
const SelectBudgetSchemaDB = createSelectSchema(BudgetSchema)

/**
 * Disables ID to be generated automatically.
 */
const InsertServiceSchema = InsertBudgetSchemaDB.omit({ id: true })

/**
 * Exports type to be used by any consumer of the service.
 */
export type InsertServiceSchemaType = z.TypeOf<typeof InsertServiceSchema>

/**
 * Exports type to be used by any consumer of the service.
 */
export type Budget = z.TypeOf<typeof SelectBudgetSchemaDB>

/**
 * Retrieves all the budgets.
 */
export const getBudgets = async () => {
  return await db.select().from(BudgetSchema)
}

/**
 * Creates a new budget.
 *
 * If no `startDate` is provided, it will use the first day of the current
 * month.
 * If no `endDate` is provided, it will use the last day of the current
 * month.
 * @param budget Object for the property to create.
 */
export const createBudget = async (
  budget: InsertServiceSchemaType,
): Promise<Budget> => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .getTime()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .getTime()

  const DEFAULT: Budget = {
    id: generateId(),
    name: '',
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  }

  const value: Budget = {
    ...DEFAULT,
    ...budget,
  }

  const result = await db.insert(BudgetSchema).values(value).returning()

  return result[0]
}
