import type { AccountType } from "./AccountType.ts"
import type { IAccount } from "./IAccount.ts"

export interface IAsset extends IAccount {
  type: AccountType.Asset
}
