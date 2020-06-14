import * as R from 'ramda'
import { State } from '../../..'
import { TestAndParseExpression, ParsedExpression, Expression } from '.'
import { right, left } from 'fp-ts/lib/Either'
import { isStringOrNumber } from '../../../../typeGuards'

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

const ensureSingleValue: (
  expression: Expression
) => (val: any) => ParsedExpression = expression => val =>
  isStringOrNumber(val)
    ? right(val)
    : left(`The path ${R.join('/', expression)} is not a single value`)

const getValue: (state: State) => TestAndParseExpression = state => [
  R.pipe(hasPathTo(state), R.isNil, R.not),
  expression =>
    R.pipe(pathTo(state), ensureSingleValue(expression))(expression),
]

export default getValue
