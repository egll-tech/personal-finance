import { BudgetSchema, db } from '../db/index.ts'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { generateId } from '../utils/generateId.ts'
import {} from '@std/datetime'

/**
 * Retrieves all the budgets.
 */
export const getBudgets = async () => {
  return await db.select().from(BudgetSchema)
}

type NewBudget = InferInsertModel<typeof BudgetSchema>
type Budget = InferSelectModel<typeof BudgetSchema>

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
  budget: Omit<NewBudget, 'id'>,
): Promise<Budget> => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .getTime()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .getTime()

  const value: NewBudget = {
    ...budget,
    id: generateId(),
    startDate: budget.startDate ? budget.startDate : firstDayOfMonth,
    endDate: budget.endDate ? budget.endDate : lastDayOfMonth,
  }

  const result = await db.insert(BudgetSchema).values(value).returning()

  return result[0]
}
