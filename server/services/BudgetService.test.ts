import { assertExists, assertStrictEquals } from '@std/assert'
import {
  createBudget,
  deleteBudget,
  getBudgets,
  type InsertBudgetSchemaType,
  updateBudget,
} from './BudgetService.ts'
import type { Budget } from './BudgetService.ts'
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

