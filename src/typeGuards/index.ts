export function isNumber(x: any): x is number {
  return typeof x === 'number'
}

export function isString(x: any): x is number {
  return typeof x === 'string'
}

export function isStringOrNumber(x: any): x is string | number {
  return isString(x) || isNumber(x)
}
