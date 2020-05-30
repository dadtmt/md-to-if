import * as R from 'ramda'

import parseExpression, { ParsedExpression, Expression } from './expressions'
import { TestCommandAndUpdateState } from '.'
import { State } from '../..'

// TODO : type operator and Error 'not a valid operator'
const getTestFunction: (
  operator: string
) => (left: ParsedExpression, right: ParsedExpression) => boolean = operator =>
  R[operator]

// [String], State -> Boolean
const evaluateTest: (args: string[], state: State) => boolean = (
  args,
  state
) => {
  const [leftExpressionAndOperator, valAndRightExpression] = R.splitWhen(
    R.equals('val')
  )(args)
  const leftExpression = R.pipe(
    R.dropLast(1),
    parseExpression(state)
  )(leftExpressionAndOperator)
  const operator = R.last(leftExpressionAndOperator) || 'missing operator'
  const rightExpression = R.pipe(
    R.drop(1),
    parseExpression(state)
  )(valAndRightExpression)
  return getTestFunction(operator)(leftExpression, rightExpression)
}

const test: TestCommandAndUpdateState = [
  R.propEq('instruction', 'test'),
  ({ args }) => state =>
    R.assoc('testResult', evaluateTest(args, state))(state),
]

export default test
