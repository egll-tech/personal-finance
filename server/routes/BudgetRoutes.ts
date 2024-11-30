import { Router } from "@oak/oak"
import { fetchBudgets } from "../controllers/BudgetController.ts"

const router = new Router()
router.get("/budgets", fetchBudgets)

export default router
