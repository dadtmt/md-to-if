import { isRight } from 'fp-ts/lib/Either'
import R from 'ramda'
import parseExpression, {
  ParsedExpression,
  ExpressionValidResult,
  Expression
} from '.'
import { State } from '../moves'

const decodeExpression: (
  parsedExpression: ParsedExpression
) => ExpressionValidResult = (parsedExpression) =>
  isRight(parsedExpression) ? parsedExpression.right : parsedExpression.left

const resolve: (
  state: State
) => (expression: Expression) => ExpressionValidResult = (state) =>
  R.pipe(parseExpression(state), decodeExpression)

export default resolve
