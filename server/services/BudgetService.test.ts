import { assertExists, assertStrictEquals } from '@std/assert'
import {
  createBudget,
  deleteBudget,
  getBudgets,
  type InsertBudgetSchemaType,
  updateBudget,
} from './BudgetService.ts'
import type { Budget } from './BudgetService.ts'
import { createIncome, getIncome } from './IncomeService.ts'
import { getBudget } from './BudgetService.ts'

Deno.test({
  name: 'check DATABASE_URL is set.',
  permissions: { env: true },
}, () => {
  assertExists(Deno.env.get('DATABASE_URL'))
})

Deno.test({
  name:
    'insert new budget without startDate or endDate. Defaults to the first and last day of current month.',
  permissions: { env: true, ffi: true },
}, async () => {
  const expectedName = 'newly created budget 1'
  const input: InsertBudgetSchemaType = {
    name: expectedName,
  }

  const result = await createBudget(input)

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
  const lastDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  )

  assertExists(result.id)
  assertStrictEquals(result.name, expectedName)
  assertStrictEquals(result.startDate, firstDayOfMonth.getTime())
  assertStrictEquals(result.endDate, lastDayOfMonth.getTime())
})

Deno.test({
  name: 'insert new budget allows selecting the startDate',
  permissions: { env: true, ffi: true },
}, async () => {
  const expectedName = 'newly create budget 2'
  const expectedStartDate = Date.now()

  const input: InsertBudgetSchemaType = {
    name: expectedName,
    startDate: Date.now(),
  }

  const result = await createBudget(input)

  assertExists(result.id)
  assertStrictEquals(result.startDate, expectedStartDate)
})

Deno.test({
  name: 'insert new budget allows selecting the endDate',
  permissions: { env: true, ffi: true },
}, async () => {
  const expectedName = 'newly create budget 3'
  const expectedEndDate = Date.now()

  const input: InsertBudgetSchemaType = {
    name: expectedName,
    endDate: Date.now(),
  }

  const result = await createBudget(input)

  assertExists(result.id)
  assertStrictEquals(result.endDate, expectedEndDate)
})

Deno.test({
  name: 'updates an existing budget',
  permissions: { env: true, ffi: true },
}, async () => {
  // First create a budget
  const originalName = 'original budget name'
  const budget = await createBudget({ name: originalName })

  // Update the budget
  const updatedName = 'updated budget name'
  const updatedStartDate = Date.now()
  const updatedEndDate = Date.now() + 1000

  const result = await updateBudget(budget.id, {
    name: updatedName,
    startDate: updatedStartDate,
    endDate: updatedEndDate,
  })

  // Verify the updates
  assertExists(result)
  assertStrictEquals(result.id, budget.id)
  assertStrictEquals(result.name, updatedName)
  assertStrictEquals(result.startDate, updatedStartDate)
  assertStrictEquals(result.endDate, updatedEndDate)
})

Deno.test({
  name: 'can retrieve and delete all budgets',
  permissions: { env: true, ffi: true },
}, async (t) => {
  let budgets: Budget[] = []

  await t.step('get all the budgets', async () => {
    budgets = await getBudgets()
    assertExists(budgets)
  })

  await t.step('delete all budgets', async () => {
    for (const budget of budgets) {
      await deleteBudget(budget.id)
    }
  })

  await t.step('verify all budgets were deleted', async () => {
    const remainingBudgets = await getBudgets()
    assertStrictEquals(remainingBudgets.length, 0)
  })
})

Deno.test({
  name: 'retrieving a budget includes its associated incomes',
  permissions: { env: true, ffi: true },
}, async () => {
  // Create a test budget
  const budget = await createBudget({ name: 'Budget with incomes' })

  // Create some test incomes associated with this budget
  const income1 = await createIncome({
    budgetId: budget.id,
    plannedAmount: '1000.00',
    name: 'Salary',
    plannedPayDate: Date.now(),
  })
  const income2 = await createIncome({
    budgetId: budget.id,
    plannedAmount: '500.50',
    name: 'Side gig',
    plannedPayDate: new Date().getTime() + (15 * 24 * 60 * 60 * 1000),
  })

  // Retrieve the budget
  const retrievedBudget = await getBudget(budget.id)

  // Verify the budget has its incomes populated
  assertExists(retrievedBudget?.income)
  assertStrictEquals(retrievedBudget?.income.length, 2)

  // Verify the income details are correct
  const foundIncome1 = retrievedBudget?.income.find((i) => i.id === income1.id)
  const foundIncome2 = retrievedBudget?.income.find((i) => i.id === income2.id)

  assertExists(foundIncome1)
  assertExists(foundIncome2)
  assertStrictEquals(foundIncome1.plannedAmount, 1000.00)
  assertStrictEquals(foundIncome2.plannedAmount, 500.50)

  // Clean up
  await deleteBudget(budget.id) // This should cascade delete the incomes as well

  const afterDeleteIncome1 = await getIncome(income1.id)
  const afterDeleteIncome2 = await getIncome(income2.id)

  assertStrictEquals(afterDeleteIncome1, undefined)
  assertStrictEquals(afterDeleteIncome2, undefined)
})
