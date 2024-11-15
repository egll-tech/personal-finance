import type { ICycleTime } from "../time/ICycleTime.ts"
import type { AccountType } from "./AccountType.ts"
import type { IAccount } from "./IAccount.ts"

export interface ILiability extends IAccount {
  type: AccountType.Liability

  cycleTime: ICycleTime
}
