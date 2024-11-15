import type { AccountType } from "./AccountType.ts"

export interface IAccount {
  id: string
  name: string
  type: AccountType
}
