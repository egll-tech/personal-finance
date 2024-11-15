import type { ITime } from "./ITime.ts"

export interface ICycleTime {
  time: ITime

  numberOfCycles: number

  currentCycle: number
}
