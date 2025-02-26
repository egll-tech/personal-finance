import { Router } from '@oak/oak'
import { SimpleController } from '../controllers/SimpleController.ts'
import { createBudget, getBudgets } from '../services/BudgetService.ts'
import { createExpense } from '../services/ExpenseService.ts'
import { createIncome } from '../services/IncomeService.ts'

const router = new Router()
router.get('/budgets', SimpleController(getBudgets))
router.post('/budget', SimpleController(createBudget))
router.post('/budget/:id/income', SimpleController(createIncome))
router.post('/budget/:id/expense', SimpleController(createExpense))
export default router
