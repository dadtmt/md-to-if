import { ExpressionValidResult } from '../expressions'

export function isNumber(x: any): x is number {
  return typeof x === 'number'
}

export function isString(x: any): x is string {
  return typeof x === 'string'
}

export function isBool(x: any): x is boolean {
  return typeof x === 'boolean'
}

export function isStringOrNumber(x: any): x is ExpressionValidResult {
  return isString(x) || isNumber(x) || isBool(x)
}
