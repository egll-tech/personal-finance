import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from 'npm:@libsql/client/node'
import { Budget, BudgetItem, Category, Expense, Income } from './schema.ts'

const client = createClient({ url: Deno.env.get('DATABASE_URL')! })
export const db = drizzle({ client })

export const BudgetSchema = Budget
export const BudgetItemSchema = BudgetItem
export const IncomeSchema = Income
export const ExpenseSchema = Expense
export const CategorySchema = Category
