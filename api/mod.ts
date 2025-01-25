export enum BudgetItemType {
  Income = 'income',
  Expense = 'expense',
}

export enum IncomeStatus {
  Planned = 'planned',
  Completed = 'completed',
}

export enum ExpenseStatus {
  Planned = 'planned',
  Initiated = 'initiated',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export * from './database/mod.ts'
export * from './types/mod.ts'
