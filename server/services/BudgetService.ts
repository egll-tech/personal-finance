import { BudgetSchema, db } from '../db/index.ts'
import { generateId } from '../utils/generateId.ts'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { eq } from 'drizzle-orm'

/**
 * Schema from the DB. Objects should always match this.
 */
const SelectBudgetSchemaDB = createSelectSchema(BudgetSchema)

/**
 * Exports type to be used by any consumer of the service.
 */
export type Budget = z.TypeOf<typeof SelectBudgetSchemaDB>

/**
 * Overrides the DB schema, indicating which fields are optional for the
 * service.
 */
const InsertBudgetSchemaDB = createInsertSchema(BudgetSchema, {
  startDate: z.number().optional(),
  endDate: z.number().optional(),
})

/**
 * Disables ID to be generated automatically.
 */
const InsertServiceSchema = InsertBudgetSchemaDB.omit({ id: true })

/**
 * Exports type to be used by any consumer of the service.
 */
export type InsertBudgetSchemaType = z.TypeOf<typeof InsertServiceSchema>

/**
 * Retrieves all the budgets.
 */
export const getBudgets = async () => {
  return await db.select().from(BudgetSchema)
}

export const getBudget = async (id: string) => {
  return await db.query.Budget.findFirst({
    with: {
      income: true,
      expense: true,
    },
    where: eq(BudgetSchema.id, id),
  })
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
  budget: InsertBudgetSchemaType,
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

/**
 * Updates an existing budget.
 * @param id The ID of the budget to update
 * @param budget The budget properties to update
 */
export const updateBudget = async (
  id: string,
  budget: Partial<InsertBudgetSchemaType>,
): Promise<Budget> => {
  const result = await db
    .update(BudgetSchema)
    .set(budget)
    .where(eq(BudgetSchema.id, id))
    .returning()

  return result[0]
}

/**
 * Deletes an existing budget.
 * @param id The ID of the budget to delete
 * @throws Error if budget with given ID does not exist
 */
export const deleteBudget = async (id: string): Promise<void> => {
  // First check if budget exists
  const existing = await db
    .select()
    .from(BudgetSchema)
    .where(eq(BudgetSchema.id, id))
    .limit(1)

  if (!existing.length) {
    throw new Error(`Budget with ID ${id} not found`)
  }

  await db
    .delete(BudgetSchema)
    .where(eq(BudgetSchema.id, id))
}
