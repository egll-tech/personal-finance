import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from 'npm:@libsql/client/node'
import {
  Budget,
  BudgetRelations,
  Category,
  CategoryRelations,
  Expense,
  ExpenseRelations,
  ExpenseToCategory,
  Income,
  IncomeRelations,
} from './schema.ts'

const client = createClient({ url: Deno.env.get('DATABASE_URL')! })
export const db = drizzle({
  schema: {
    Budget,
    Category,
    Expense,
    Income,
    BudgetRelations,
    CategoryRelations,
    ExpenseRelations,
    ExpenseToCategory,
    IncomeRelations,
  },
  client,
})

export const BudgetSchema = Budget
export const IncomeSchema = Income
export const ExpenseSchema = Expense
export const CategorySchema = Category
export const ExpenseToCategorySchema = ExpenseToCategory
