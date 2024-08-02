import BigNumber from 'bignumber.js'
import ValidationException from '~/exceptions/ValidationException'

export const sumBy = <T>(arr: T[], func: (item: T) => number): number => arr.reduce((acc, item) => acc + func(item), 0)

// Overload signatures
export function bigSumBy<T>(arr: T[], func: (item: T) => number, returnAsString: true): string
export function bigSumBy<T>(arr: T[], func: (item: T) => number, returnAsString: false): number

// Implementation
export function bigSumBy<T>(arr: T[], func: (item: T) => number, returnAsString: boolean = true): string | number {
  const sum = arr.reduce((acc, item) => acc.plus(new BigNumber(func(item).toString())), new BigNumber(0))
  return returnAsString ? sum.toString() : sum.toNumber()
}

export const randomChoice = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export const createBigNumber = (value: string | number | undefined | null): BigNumber => {

  if (!value)
    return new BigNumber(0)

  const stringValue = value.toString()

  try {
    return new BigNumber(stringValue)
  } catch (error) {
    new ValidationException(`Invalid input for BigNumber`, { value, valueType: typeof value }, { sendToast: false, sentryLogLevel: 'error' })
    return new BigNumber(0)
  }
}