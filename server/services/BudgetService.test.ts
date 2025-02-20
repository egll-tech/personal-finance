import {
  assertAlmostEquals,
  assertExists,
  assertStrictEquals,
} from '@std/assert'
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from './BudgetService.ts'
import { createIncome, getIncome } from './IncomeService.ts'
import { getBudget } from './BudgetService.ts'
// import { createExpense, getExpense } from './ExpenseService.ts'
import {
  ExpenseStatus,
  type InsertBudgetSchemaType,
  SelectBudgetSchemaType,
} from '@personal-finance/api'
import { DateTime } from 'luxon'

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

  const firstDayOfMonth = DateTime.now().startOf('month').toUnixInteger()
  const lastDayOfMonth = DateTime.now().endOf('month').toUnixInteger()

  assertExists(result.id)
  assertStrictEquals(result.name, expectedName)
  assertAlmostEquals(
    DateTime.fromJSDate(result.startDate).toUnixInteger(),
    firstDayOfMonth,
  )
  assertStrictEquals(
    DateTime.fromJSDate(result.endDate).toUnixInteger(),
    lastDayOfMonth,
  )
})

Deno.test({
  name: 'insert new budget allows selecting the startDate',
  permissions: { env: true, ffi: true },
}, async () => {
  const expectedName = 'newly create budget 2'
  const expectedStartDate = DateTime.now().toUnixInteger()

  const input: InsertBudgetSchemaType = {
    name: expectedName,
    startDate: DateTime.now().toISO({ includeOffset: true }),
  }

  const result = await createBudget(input)

  assertExists(result.id)
  assertStrictEquals(
    DateTime.fromJSDate(result.startDate).toUnixInteger(),
    expectedStartDate,
  )
})

Deno.test({
  name: 'insert new budget allows selecting the endDate',
  permissions: { env: true, ffi: true },
}, async () => {
  const expectedName = 'newly create budget 3'
  const expectedEndDate = DateTime.now().toUnixInteger()

  const input: InsertBudgetSchemaType = {
    name: expectedName,
    endDate: DateTime.now().toISO({ includeOffset: true }),
  }

  const result = await createBudget(input)

  assertExists(result.id)
  assertStrictEquals(
    DateTime.fromJSDate(result.endDate).toUnixInteger(),
    expectedEndDate,
  )
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
  const updatedStartDate = DateTime.now().toISO({ includeOffset: true })
  const updatedEndDate = DateTime.now().plus({ days: 10 }).toISO({
    includeOffset: true,
  })

  const result = await updateBudget(budget.id, {
    name: updatedName,
    startDate: updatedStartDate,
    endDate: updatedEndDate,
  })

  // Verify the updates
  assertExists(result)
  assertStrictEquals(result.id, budget.id)
  assertStrictEquals(result.name, updatedName)
  assertStrictEquals(
    DateTime.fromJSDate(result.startDate).toUnixInteger(),
    DateTime.fromISO(updatedStartDate).toUnixInteger(),
  )
  assertStrictEquals(
    DateTime.fromJSDate(result.endDate).toUnixInteger(),
    DateTime.fromISO(updatedEndDate).toUnixInteger(),
  )
})

Deno.test({
  name: 'can retrieve and delete all budgets',
  permissions: { env: true, ffi: true },
}, async (t) => {
  let budgets: SelectBudgetSchemaType[] = []

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
    plannedPayDate: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toISO({ includeOffset: true }),
  })
  const income2 = await createIncome({
    budgetId: budget.id,
    plannedAmount: '500.50',
    name: 'Side gig',
    plannedPayDate: DateTime.now().plus({ days: 15 }).toJSDate(),
    updatedAt: DateTime.now().toISO({ includeOffset: true }),
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

Deno.test({
  name: 'retrieving a budget includes its associated expenses',
  permissions: { env: true, ffi: true },
}, async () => {
  // Create a test budget
  const budget = await createBudget({ name: 'Budget with expenses' })

  //   // Create some test expenses associated with this budget
  //   const expense1 = await createExpense({
  //     budgetId: budget.id,
  //     plannedAmount: '750.00',
  //     name: 'Rent',
  //     description: 'Monthly rent payment',
  //     status: ExpenseStatus.Planned,
  //     dueDate: Date.now(),
  //   })
  //   const expense2 = await createExpense({
  //     budgetId: budget.id,
  //     plannedAmount: '100.00',
  //     name: 'Utilities',
  //     description: 'Monthly utilities',
  //     status: ExpenseStatus.Planned,
  //     dueDate: new Date().getTime() + (15 * 24 * 60 * 60 * 1000),
  //   })

  //   // Retrieve the budget
  //   const retrievedBudget = await getBudget(budget.id)

  //   // Verify the budget has its expenses populated
  //   assertExists(retrievedBudget?.expense)
  //   assertStrictEquals(retrievedBudget?.expense.length, 2)

  //   // Verify the expense details are correct
  //   const foundExpense1 = retrievedBudget?.expense.find((e) =>
  //     e.id === expense1.id
  //   )
  //   const foundExpense2 = retrievedBudget?.expense.find((e) =>
  //     e.id === expense2.id
  //   )

  //   assertExists(foundExpense1)
  //   assertExists(foundExpense2)
  //   assertStrictEquals(foundExpense1.plannedAmount, 750.00)
  //   assertStrictEquals(foundExpense2.plannedAmount, 100.00)
  //   assertStrictEquals(foundExpense1.name, 'Rent')
  //   assertStrictEquals(foundExpense2.name, 'Utilities')

  // Clean up
  await deleteBudget(budget.id) // This should cascade delete the expenses as well

  //   const afterDeleteExpense1 = await getExpense(expense1.id)
  //   const afterDeleteExpense2 = await getExpense(expense2.id)

  //   assertStrictEquals(afterDeleteExpense1, undefined)
  //   assertStrictEquals(afterDeleteExpense2, undefined)
})

Deno.test({
  name: 'budget retrieves associated income and expenses',
  permissions: { env: true, ffi: true },
}, async () => {
  // Create a test budget
  const budget = await createBudget({
    name: 'Test Budget with Income and Expenses',
  })

  // Create test income records
  const income1 = await createIncome({
    budgetId: budget.id,
    plannedAmount: '2000.00',
    name: 'Salary',
    plannedPayDate: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toISO({ includeOffset: true }),
  })

  const income2 = await createIncome({
    budgetId: budget.id,
    plannedAmount: '500.00',
    name: 'Side Gig',
    plannedPayDate: DateTime.now().plus({ days: 7 }).toJSDate(),
    updatedAt: DateTime.now().toISO({ includeOffset: true }),
  })

  // // Create test expense records
  // const expense1 = await createExpense({
  //   budgetId: budget.id,
  //   plannedAmount: '1000.00',
  //   name: 'Rent',
  //   status: ExpenseStatus.Planned,
  //   dueDate: DateTime.now().toISO({ includeOffset: true }),
  // })

  // const expense2 = await createExpense({
  //   budgetId: budget.id,
  //   plannedAmount: '200.00',
  //   name: 'Groceries',
  //   status: ExpenseStatus.Planned,
  //   dueDate: DateTime.now().toISO({ includeOffset: true }),
  // })

  // Retrieve the budget and verify relationships
  const retrievedBudget = await getBudget(budget.id)
  assertExists(retrievedBudget)

  // Verify income records
  assertExists(retrievedBudget.income)
  assertStrictEquals(retrievedBudget.income.length, 2)

  const foundIncome1 = retrievedBudget.income.find((i) => i.id === income1.id)
  const foundIncome2 = retrievedBudget.income.find((i) => i.id === income2.id)

  assertExists(foundIncome1)
  assertExists(foundIncome2)
  assertStrictEquals(foundIncome1.plannedAmount, 2000.00)
  assertStrictEquals(foundIncome2.plannedAmount, 500.00)
  assertStrictEquals(foundIncome1.name, 'Salary')
  assertStrictEquals(foundIncome2.name, 'Side Gig')

  // // Verify expense records
  // assertExists(retrievedBudget.expense)
  // assertStrictEquals(retrievedBudget.expense.length, 2)

  // const foundExpense1 = retrievedBudget.expense.find((e) =>
  //   e.id === expense1.id
  // )
  // const foundExpense2 = retrievedBudget.expense.find((e) =>
  //   e.id === expense2.id
  // )

  // assertExists(foundExpense1)
  // assertExists(foundExpense2)
  // assertStrictEquals(foundExpense1.plannedAmount, 1000.00)
  // assertStrictEquals(foundExpense2.plannedAmount, 200.00)
  // assertStrictEquals(foundExpense1.name, 'Rent')
  // assertStrictEquals(foundExpense2.name, 'Groceries')

  // Clean up
  await deleteBudget(budget.id)

  // Verify cascade deletion
  const afterDeleteIncome1 = await getIncome(income1.id)
  const afterDeleteIncome2 = await getIncome(income2.id)
  // const afterDeleteExpense1 = await getExpense(expense1.id)
  // const afterDeleteExpense2 = await getExpense(expense2.id)

  assertStrictEquals(afterDeleteIncome1, undefined)
  assertStrictEquals(afterDeleteIncome2, undefined)
  // assertStrictEquals(afterDeleteExpense1, undefined)
  // assertStrictEquals(afterDeleteExpense2, undefined)
})
