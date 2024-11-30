import { Budget, db } from '../db/index.ts'

export const getBudgets = async () => {
  return await db.select().from(Budget)
}
