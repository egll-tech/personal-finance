import { assertEquals, assertExists, assertStrictEquals } from '@std/assert'
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  tagExpenseWithCategory,
  untagExpenseFromCategory,
  updateExpense,
} from './ExpenseService.ts'
import { ExpenseStatus } from '@personal-finance/api'
import { db, ExpenseToCategorySchema } from '../db/index.ts'
import { eq } from 'drizzle-orm'
import { createBudget } from './BudgetService.ts'
import { createCategory } from './CategoryService.ts'

let createdExpense: Awaited<ReturnType<typeof createExpense>>

Deno.test({
  name: 'Expense CRUD operations',
  permissions: { env: true, ffi: true },
}, async (t) => {
  const name = 'Test Expense'
  const description = 'Test Description'
  const plannedAmount = '100.00'

  // First create a budget to associate incomes with
  const budget = await createBudget({ name: 'Expenses Test Budget' })
  const category = await createCategory({ name: 'Expense Test Category' })

  await t.step('create expense', async () => {
    createdExpense = await createExpense({
      name,
      description,
      budgetId: budget.id,
      plannedAmount,
      status: ExpenseStatus.Planned,
      dueDate: Date.now(),
    })

    assertExists(createdExpense)
    assertStrictEquals(createdExpense.name, name)
    assertStrictEquals(createdExpense.description, description)
    assertStrictEquals(createdExpense.budgetId, budget.id)
    assertStrictEquals(createdExpense.plannedAmount, Number(plannedAmount))
  })

  await t.step('get single expense', async () => {
    const retrievedExpense = await getExpense(createdExpense!.id)
    assertExists(retrievedExpense)
    assertStrictEquals(retrievedExpense.id, createdExpense!.id)
  })

  await t.step('update expense', async () => {
    const updatedName = 'Updated Expense Name'
    const updatedDescription = 'Updated Description'
    const updatedAmount = '150.00'

    const result = await updateExpense(createdExpense!.id, {
      name: updatedName,
      description: updatedDescription,
      plannedAmount: updatedAmount,
    })

    assertExists(result)
    assertStrictEquals(result.name, updatedName)
    assertStrictEquals(result.description, updatedDescription)
    assertStrictEquals(result.plannedAmount, Number(updatedAmount))
  })

  await t.step('get all expenses', async () => {
    const allExpenses = await getExpenses()
    assertExists(allExpenses)
    assertStrictEquals(allExpenses.length >= 1, true)
  })

  await t.step('tag expense with category', async () => {
    await tagExpenseWithCategory(createdExpense!.id, category.id)

    const association = await db.select().from(ExpenseToCategorySchema).where(
      eq(ExpenseToCategorySchema.expenseId, createdExpense!.id),
    )

    assertStrictEquals(association.length, 1)
    assertStrictEquals(association[0].categoryId, category.id)
  })

  await t.step('untag expense from category', async () => {
    await untagExpenseFromCategory(createdExpense!.id, category.id)

    const association = await db.select().from(ExpenseToCategorySchema).where(
      eq(ExpenseToCategorySchema.expenseId, createdExpense!.id),
    )

    assertStrictEquals(association.length, 0)
  })

  await t.step('delete expense', async () => {
    await deleteExpense(createdExpense!.id)
    const deletedExpense = await getExpense(createdExpense!.id)
    assertStrictEquals(deletedExpense, undefined)
  })
})

Deno.test({
  name: 'deleting non-existent expense throws error',
  permissions: { env: true, ffi: true },
}, async () => {
  const nonExistentId = 'non-existent-id'

  try {
    await deleteExpense(nonExistentId)
    throw new Error('Should have thrown error for non-existent expense')
  } catch (error: unknown) {
    assertStrictEquals(
      (error as Error).message,
      `Expense with ID ${nonExistentId} not found`,
    )
  }
})

Deno.test({
  name: 'tagging non-existent expense throws error',
  permissions: { env: true, ffi: true },
}, async () => {
  const nonExistentId = 'non-existent-id'
  const categoryId = 'test-category-id'

  try {
    await tagExpenseWithCategory(nonExistentId, categoryId)
    throw new Error('Should have thrown error for non-existent expense')
  } catch (error: unknown) {
    assertStrictEquals(
      (error as Error).message,
      `Expense with ID ${nonExistentId} not found`,
    )
  }
})

Deno.test({
  name: 'untagging non-existent expense throws error',
  permissions: { env: true, ffi: true },
}, async () => {
  const nonExistentId = 'non-existent-id'
  const categoryId = 'test-category-id'

  try {
    await untagExpenseFromCategory(nonExistentId, categoryId)
    throw new Error('Should have thrown error for non-existent expense')
  } catch (error: unknown) {
    assertStrictEquals(
      (error as Error).message,
      `Expense with ID ${nonExistentId} not found`,
    )
  }
})
