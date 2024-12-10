import { db, ExpenseSchema, ExpenseToCategorySchema } from '../db/index.ts'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { generateId } from '../utils/generateId.ts'
import { ExpenseStatus } from '@personal-finance/api'
import { and, eq } from 'drizzle-orm'

const SelectExpenseSchemaDB = createSelectSchema(ExpenseSchema)

export type Expense = z.TypeOf<typeof SelectExpenseSchemaDB>

const InsertExpenseSchemaDB = createInsertSchema(ExpenseSchema, {
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

const InsertServiceSchema = InsertExpenseSchemaDB.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type InsertExpenseSchemaType = z.TypeOf<typeof InsertServiceSchema>

export const createExpense = async (expense: InsertExpenseSchemaType) => {
  const now = Date.now()
  const DEFAULT: Expense = {
    id: generateId(),
    name: '',
    description: null,
    status: ExpenseStatus.Planned,
    plannedAmount: '0.0',
    actualAmount: null,
    dueDate: now,
    createdAt: now,
    updatedAt: now,
    initiationDate: null,
    cancelationDate: null,
    completionDate: null,

    budgetId: expense.budgetId,
  }

  const input: Expense = {
    ...DEFAULT,
    ...expense,
  }

  const result = await db.insert(ExpenseSchema).values(input).returning()

  return result[0]
}

export const getExpenses = async () => {
  return await db.select().from(ExpenseSchema)
}

/**
 * Updates an existing expense.
 * @param id The ID of the expense to update
 * @param expense The expense properties to update
 */
export const updateExpense = async (
  id: string,
  expense: Partial<InsertExpenseSchemaType>,
): Promise<Expense> => {
  const result = await db
    .update(ExpenseSchema)
    .set(expense)
    .where(eq(ExpenseSchema.id, id))
    .returning()

  return result[0]
}

/**
 * Gets a single expense by ID.
 * @param id The ID of the expense to retrieve
 */
export const getExpense = async (id: string) => {
  return await db.query.Expense.findFirst({
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

  await db.delete(ExpenseSchema).where(eq(ExpenseSchema.id, id))
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

  await db.insert(ExpenseToCategorySchema).values({
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

  await db.delete(ExpenseToCategorySchema)
    .where(
      and(
        eq(ExpenseToCategorySchema.expenseId, expenseId),
        eq(ExpenseToCategorySchema.categoryId, categoryId),
      ),
    )
}
