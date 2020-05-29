import * as R from 'ramda'

import parseExpression from './expressions'
import { Command } from '.'
import { State } from '../..'

// String -> String, String -> Boolean|ErrorString
const getTestFunction: (
  operator: string
) => (left: string, right: string | number) => boolean = operator => R[operator]

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
  const operator = R.last(leftExpressionAndOperator)
  const rightExpression = R.pipe(
    R.drop(1),
    parseExpression(state)
  )(valAndRightExpression)
  return getTestFunction(operator)(leftExpression, rightExpression)
}

// [Command -> Boolean, Command -> State -> State]
const test: [
  (command: Command) => boolean,
  (command: Command) => (state: State) => State
] = [
  R.propEq('instruction', 'test'),
  ({ args }) => state =>
    R.assoc('testResult', evaluateTest(args, state))(state),
]

export default test
