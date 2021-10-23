import * as R from 'ramda'
import { State } from '../moves'
import { TestAndParseExpression, ParsedExpression, Expression } from '.'
import { right, left } from 'fp-ts/lib/Either'
import { isStringOrNumber } from '../typeGuards'

const hasPathTo = R.flip(R.path)

const pathTo = R.flip(R.path)

const ensureSingleValue: (
  expression: Expression
) => (val: any) => ParsedExpression = (expression) => (val) =>
  isStringOrNumber(val)
    ? right(val)
    : left(`The path ${R.join('/', expression)} is not a single value`)

const getValue: (state: State) => TestAndParseExpression = ({ store }) => [
  R.pipe(hasPathTo(store), R.isNil, R.not),
  (expression) => {
    return R.pipe(pathTo(store), ensureSingleValue(expression))(expression)
  }
]

export default getValue
