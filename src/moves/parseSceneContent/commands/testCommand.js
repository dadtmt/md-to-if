import * as R from 'ramda'

import parseExpression from './expressions'

// String -> String, String -> Boolean|ErrorString
const getTestFunction = operator => {
  if (operator === 'equals') {
    return R.equals
  } else {
    return R.always('illegal-operator')
  }
}

// [String], State -> Boolean
const evaluateTest = (args, state) => {
  const [leftExpressionAndOperator, valAndRightExpression] = R.splitWhen(
    R.equals('val')
  )(args)
  const leftExpression = R.pipe(
    R.dropLast(1),
    parseExpression(state)
  )(leftExpressionAndOperator)
  const operator = R.last(leftExpressionAndOperator)
  const rightExpression = R.pipe(
    R.drop(1),
    parseExpression(state)
  )(valAndRightExpression)
  return getTestFunction(operator)(leftExpression, rightExpression)
}

// [Command -> Boolean, Command -> State -> State]
const test = [
  R.propEq('instruction', 'test'),
  ({ args }) => state =>
    R.assoc('testResult', evaluateTest(args, state))(state),
]

export default test
