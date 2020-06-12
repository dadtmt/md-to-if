import * as R from 'ramda'

import parseExpression, { ParsedExpression, Expression } from './expressions'
import { TestCommandAndUpdateState, Command } from '.'
import { State } from '../..'
import { right, Either, isRight, left } from 'fp-ts/lib/Either'

type TestFunction = (left: ParsedExpression, right: ParsedExpression) => boolean
type TestEvaluation = (
  command: Command,
  state: State
) => Either<string, boolean>

// TODO : check number typees for some operators like lte
const getTestFunction: (
  operator: string
) => Either<string, TestFunction> = operator =>
  R.cond<string, Either<string, TestFunction>>([
    [R.equals('equals'), () => right(R.equals)],
    [R.equals('lte'), () => right(R.lte)],
    [R.T, () => left(`Operator ${operator} is not valid`)],
  ])(operator)

const evaluateTest: TestEvaluation = ({ args }, state) => {
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

  const testFunction = getTestFunction(operator)
  return isRight(testFunction)
    ? right(testFunction.right(leftExpression, rightExpression))
    : left(testFunction.left)
}

const storeTestResult = (testResult: boolean) =>
  R.assoc('testResult', testResult)

const test: TestCommandAndUpdateState = [
  R.propEq('instruction', 'test'),
  command => state => {
    const testEvaluation = evaluateTest(command, state)
    if (isRight(testEvaluation)) {
      return right(storeTestResult(testEvaluation.right)(state))
    }
    return left(testEvaluation.left)
  },
]

export default test
