import {
  BudgetSchema,
  type InsertBudgetSchemaType,
  type SelectBudgetSchemaType,
} from '@personal-finance/api'
import { eq } from 'drizzle-orm'
import { generateId } from '../utils/generateId.ts'
import { DatabaseService } from './DatabaseService.ts'
import { castAsDate, castAsString } from '../utils/cast.ts'
import { DateTime } from 'luxon'

/**
 * Retrieves all the budgets.
 */
export const getBudgets = async () => {
  return await DatabaseService.select().from(BudgetSchema)
}

export const getBudget = async (id: string) => {
  return await DatabaseService.query.BudgetSchema.findFirst({
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
): Promise<SelectBudgetSchemaType> => {
  // const today = new Date()
  // const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  //   .getTime()
  // const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  //   .getTime()

  // const DEFAULT = {
  //   id: generateId(),
  //   name: '',
  //   startDate: firstDayOfMonth,
  //   endDate: lastDayOfMonth,
  // }

  // const value = {
  //   ...DEFAULT,
  //   ...budget,
  // }

  const value = {
    id: castAsString(budget.id, generateId()),
    name: castAsString(budget.name),
    startDate: castAsDate(
      budget.startDate,
      DateTime.now().startOf('month').toJSDate(),
    ),
    endDate: castAsDate(
      budget.endDate,
      DateTime.now().endOf('month').toJSDate(),
    ),
  }

  const result = await DatabaseService.insert(BudgetSchema).values(value)
    .returning()

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
): Promise<SelectBudgetSchemaType> => {
  const updateData = {
    name: castAsString(budget.name),
    startDate: castAsDate(budget.startDate, DateTime.now().toJSDate()),
    endDate: castAsDate(budget.endDate, DateTime.now().toJSDate()),
  }

  const result = await DatabaseService
    .update(BudgetSchema)
    .set(updateData)
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
  const existing = await DatabaseService
    .select()
    .from(BudgetSchema)
    .where(eq(BudgetSchema.id, id))
    .limit(1)

  if (!existing.length) {
    throw new Error(`Budget with ID ${id} not found`)
  }

  await DatabaseService
    .delete(BudgetSchema)
    .where(eq(BudgetSchema.id, id))
}
