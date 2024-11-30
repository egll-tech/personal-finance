import type { Context } from "@oak/oak"
import { getBudgets } from "../services/BudgetService.ts"

export const fetchBudgets = async (ctx: Context) => {
  const budgets = await getBudgets()
  ctx.response.body = budgets
}
