import { Application } from 'jsr:@oak/oak/application'
import budgetRoutes from './routes/BudgetRoutes.ts'
import { errorMiddleware } from './middlewares/ErrorMiddleware.ts'

const PORT = Deno.env.get('PORT') ? Number(Deno.env.get('PORT')) : 8080
const app = new Application()

app.use(errorMiddleware)
app.use(budgetRoutes.routes())
app.use(budgetRoutes.allowedMethods())

app.listen({ port: PORT })

console.log('PORT', PORT)
