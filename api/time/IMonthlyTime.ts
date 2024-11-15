import type { ITime } from "./ITime.ts"
import type { TimePeriod } from "./TimeType.ts"

export interface IMonthlyTime extends ITime {
  type: TimePeriod.Month

  dayOfMonth?: number
}
