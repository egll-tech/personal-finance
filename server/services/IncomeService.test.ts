import { assertExists, assertStrictEquals } from '@std/assert'
import {
  createIncome,
  deleteIncome,
  getIncome,
  getIncomes,
  updateIncome,
} from './IncomeService.ts'
import { createBudget } from './BudgetService.ts'
import {
  IncomeSchemaStatus,
  type SelectIncomeSchemaType,
} from '@personal-finance/api'
import { DateTime } from 'npm:luxon'

Deno.test({
  name: 'can create, get, update and delete income',
  permissions: { env: true, ffi: true },
}, async (t) => {
  // First create a budget to associate incomes with
  const budget = await createBudget({ name: 'Test Budget' })

  let createdIncome: SelectIncomeSchemaType | undefined = undefined

  await t.step('create income', async () => {
    const plannedAmount = '1000.33'
    const name = 'Test Income'
    const plannedPayDate = DateTime.now().setZone('UTC').toJSDate()

    createdIncome = await createIncome({
      budgetId: budget.id,
      plannedAmount,
      name,
      plannedPayDate,
      updatedAt: DateTime.now().toISO({ includeOffset: true }),
    })

    assertExists(createdIncome)
    assertStrictEquals(createdIncome.name, name)
    assertStrictEquals(createdIncome.plannedAmount, Number(plannedAmount))
    assertStrictEquals(
      DateTime.fromJSDate(createdIncome.plannedPayDate).toUnixInteger(),
      DateTime.fromJSDate(plannedPayDate).toUnixInteger(),
    )
    assertStrictEquals(createdIncome.status, IncomeSchemaStatus.PLANNED)
    assertStrictEquals(createdIncome.budgetId, budget.id)
  })

  await t.step('get single income', async () => {
    const retrievedIncome = await getIncome(createdIncome!.id)
    assertExists(retrievedIncome)
    assertStrictEquals(retrievedIncome.id, createdIncome!.id)
  })

  await t.step('update income', async () => {
    const updatedName = 'Updated Income Name'
    const updatedAmount = '2000.69'
    const updatedStatus = IncomeSchemaStatus.COMPLETED

    const result = await updateIncome(createdIncome!.id, {
      name: updatedName,
      plannedAmount: updatedAmount,
      status: updatedStatus,
    })

    assertExists(result)
    assertStrictEquals(result.name, updatedName)
    assertStrictEquals(result.plannedAmount, Number(updatedAmount))
    assertStrictEquals(result.status, updatedStatus)
  })

  await t.step('get all incomes', async () => {
    const allIncomes = await getIncomes()
    assertExists(allIncomes)
    assertStrictEquals(allIncomes.length >= 1, true)
  })

  await t.step('delete income', async () => {
    await deleteIncome(createdIncome!.id)
    const deletedIncome = await getIncome(createdIncome!.id)
    assertStrictEquals(deletedIncome, undefined)
  })
})

Deno.test({
  name: 'deleting non-existent income throws error',
  permissions: { env: true, ffi: true },
}, async () => {
  const nonExistentId = 'non-existent-id'

  try {
    await deleteIncome(nonExistentId)
    throw new Error('Should have thrown error for non-existent income')
  } catch (error: unknown) {
    assertStrictEquals(
      (error as Error).message,
      `Income with ID ${nonExistentId} not found`,
    )
  }
})
