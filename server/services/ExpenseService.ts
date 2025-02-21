import {
  ExpenseSchema,
  ExpenseSchemaStatus,
  ExpenseToCategorySchema,
  type InsertExpenseSchemaType,
  SelectExpenseSchemaType,
} from '@personal-finance/api'
import { and, eq } from 'drizzle-orm'
import { DateTime } from 'luxon'
import {
  cast,
  castAsDate,
  castAsNullableDate,
  castAsNullableString,
  castAsString,
} from '../utils/cast.ts'
import { generateId } from '../utils/generateId.ts'
import { DatabaseService } from './DatabaseService.ts'

export const createExpense = async (expense: InsertExpenseSchemaType) => {
  const now = DateTime.now().toJSDate()

  const value = {
    id: castAsString(expense.id, generateId()),
    name: castAsString(expense.name),
    description: castAsNullableString(expense.description),
    status: cast<ExpenseSchemaStatus, ExpenseSchemaStatus>(
      expense.status,
      ExpenseSchemaStatus.PLANNED,
    ),
    plannedAmount: castAsString(expense.plannedAmount),
    actualAmount: castAsNullableString(expense.actualAmount),
    dueDate: castAsDate(expense.dueDate, now),
    createdAt: castAsDate(expense.createdAt, now),
    updatedAt: castAsDate(expense.updatedAt, now),
    initiationDate: castAsNullableDate(expense.initiationDate),
    cancelationDate: castAsNullableDate(expense.cancelationDate),
    completionDate: castAsNullableDate(expense.completionDate),
    budgetId: castAsString(expense.budgetId),
  }

  const result = await DatabaseService.insert(ExpenseSchema).values(value)
    .returning()

  return result[0]
}

export const getExpenses = async () => {
  return await DatabaseService.select().from(ExpenseSchema)
}

/**
 * Updates an existing expense.
 * @param id The ID of the expense to update
 * @param expense The expense properties to update
 */
export const updateExpense = async (
  id: string,
  expense: Partial<InsertExpenseSchemaType>,
): Promise<SelectExpenseSchemaType> => {
  const now = DateTime.now().toJSDate()

  const updateData = {
    name: castAsString(expense.name),
    description: castAsNullableString(expense.description),
    status: cast<ExpenseSchemaStatus, ExpenseSchemaStatus>(
      expense.status,
      ExpenseSchemaStatus.PLANNED,
    ),
    plannedAmount: castAsString(expense.plannedAmount),
    actualAmount: castAsNullableString(expense.actualAmount),
    dueDate: castAsDate(expense.dueDate, now),
    createdAt: castAsDate(expense.createdAt, now),
    updatedAt: now,
    initiationDate: castAsNullableDate(expense.initiationDate),
    cancelationDate: castAsNullableDate(expense.cancelationDate),
    completionDate: castAsNullableDate(expense.completionDate),
  }

  const result = await DatabaseService.update(ExpenseSchema)
    .set(updateData)
    .where(eq(ExpenseSchema.id, id))
    .returning()

  return result[0]
}

/**
 * Gets a single expense by ID.
 * @param id The ID of the expense to retrieve
 */
export const getExpense = async (id: string) => {
  return await DatabaseService.query.ExpenseSchema.findFirst({
    where: eq(ExpenseSchema.id, id),
  })
}

/**
 * Deletes an existing expense.
 * @param id The ID of the expense to delete
 */
export const deleteExpense = async (id: string): Promise<void> => {
  const expense = await getExpense(id)
  if (!expense) {
    throw new Error(`Expense with ID ${id} not found`)
  }

  await DatabaseService.delete(ExpenseSchema).where(eq(ExpenseSchema.id, id))
}

/**
 * Associates a category with an expense.
 * @param expenseId The ID of the expense
 * @param categoryId The ID of the category to associate
 */
export const tagExpenseWithCategory = async (
  expenseId: string,
  categoryId: string,
): Promise<void> => {
  const expense = await getExpense(expenseId)
  if (!expense) {
    throw new Error(`Expense with ID ${expenseId} not found`)
  }

  await DatabaseService.insert(ExpenseToCategorySchema).values({
    expenseId,
    categoryId,
  })
}

/**
 * Removes a category association from an expense.
 * @param expenseId The ID of the expense
 * @param categoryId The ID of the category to remove
 */
export const untagExpenseFromCategory = async (
  expenseId: string,
  categoryId: string,
): Promise<void> => {
  const expense = await getExpense(expenseId)
  if (!expense) {
    throw new Error(`Expense with ID ${expenseId} not found`)
  }

  await DatabaseService.delete(ExpenseToCategorySchema)
    .where(
      and(
        eq(ExpenseToCategorySchema.expenseId, expenseId),
        eq(ExpenseToCategorySchema.categoryId, categoryId),
      ),
    )
}
