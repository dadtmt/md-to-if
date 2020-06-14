import * as R from 'ramda'
import { State } from '../../..'
import { TestAndParseExpression, ParsedExpression } from '.'
import { right, left } from 'fp-ts/lib/Either'
import { isStringOrNumber } from '../../../../typeGuards'

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

const ensureValue: (val: any) => ParsedExpression = val =>
  isStringOrNumber(val) ? right(val) : left(`unreachable path`)

//TODO fix type string number issue
const getValue: (state: State) => TestAndParseExpression = state => [
  R.pipe(hasPathTo(state), R.isNil, R.not),
  R.pipe(pathTo(state), ensureValue),
]

export default getValue
