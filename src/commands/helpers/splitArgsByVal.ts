import R from 'ramda'

const removeVal: (parts: string[][]) => string[][] = ([
  leftPart,
  rightPart
]) => [leftPart, rightPart.slice(1)]

export const splitArgsByVal: (args: string[]) => string[][] = R.pipe(
  R.splitWhen(R.equals('val')),
  removeVal
)

export default splitArgsByVal
