import * as R from 'ramda'
import { TestAndParseExpression, Expression } from '..'
import { right, left } from 'fp-ts/lib/Either'

const getInput: (expression: Expression) => string | undefined = R.nth(1)

const rollDices: TestAndParseExpression = [
  R.pipe(R.head, R.equals('roll')),
  R.ifElse(
    R.pipe(getInput, R.isNil),
    R.always(left('The dices are missing (ex: roll d6)')),
    R.always(right(42))
  ),
]

export default rollDices
