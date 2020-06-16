import * as R from 'ramda'
import { TestAndParseExpression } from '..'
import { right } from 'fp-ts/lib/Either'

const rollDices: TestAndParseExpression = [
  R.pipe(R.head, R.equals('roll')),
  R.always(right(42)),
]

export default rollDices
