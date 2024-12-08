import { assertExists, assertStrictEquals } from '@std/assert'
import { createBudget, type InsertBudgetSchemaType } from './BudgetService.ts'

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
