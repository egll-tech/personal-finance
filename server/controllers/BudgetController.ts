import type { Context } from '@oak/oak'
import { createBudget, getBudgets } from '../services/BudgetService.ts'

export const fetchBudgets = async (ctx: Context) => {
  const budgets = await getBudgets()
  ctx.response.body = budgets
}

export const insertBudget = async (
  ctx: Context,
) => {
  const { request, response } = ctx

  if (!request.hasBody) {
    response.status = 400
    response.body = { error: 'Missing request body' }
    return
  }

  try {
    const body = await request.body.json()
    const result = await createBudget(body)
    response.status = 200
    response.body = result
  } catch (e) {
    console.log(e)
  }
}
