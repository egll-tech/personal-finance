import { Router } from '@oak/oak'
import { fetchBudgets, insertBudget } from '../controllers/BudgetController.ts'

const router = new Router()
router.get('/budgets', fetchBudgets)
router.post('/budget', insertBudget)

export default router
