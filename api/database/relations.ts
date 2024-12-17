import { relations } from 'drizzle-orm'
import { BudgetSchema } from './BudgetSchema.ts'
import { ExpenseToCategorySchema } from './ExpenseCategorySchema.ts'
import { CategorySchema } from './CategorySchema.ts'
import { IncomeSchema } from './IncomeSchema.ts'
import { ExpenseSchema } from './ExpenseSchema.ts'

export const BudgetRelations = relations(BudgetSchema, ({ many }) => ({
  income: many(IncomeSchema),
  expense: many(ExpenseSchema),
}))

export const CategoryRelations = relations(CategorySchema, ({ many }) => ({
  expenseToCategory: many(ExpenseToCategorySchema),
}))

export const ExpenseRelations = relations(ExpenseSchema, ({ one, many }) => ({
  budget: one(BudgetSchema, {
    fields: [ExpenseSchema.budgetId],
    references: [BudgetSchema.id],
  }),
  expenseToCategory: many(ExpenseToCategorySchema),
}))

export const IncomeRelations = relations(IncomeSchema, ({ one }) => ({
  budget: one(BudgetSchema, {
    fields: [IncomeSchema.budgetId],
    references: [BudgetSchema.id],
  }),
}))
