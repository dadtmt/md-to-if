import * as R from 'ramda'

import parseExpression, { ParsedExpression, Expression } from './expressions'
import {
  TestCommandAndUpdateState,
  Command,
  decodeExpression,
  splitArgsByVal,
} from '.'
import { State } from '../..'
import { right, Either, isRight, left } from 'fp-ts/lib/Either'
import { isNumber } from '../../../typeGuards'

type TestFunction = (
  leftOperand: string | number,
  rightOperand: string | number
) => Either<string, boolean>

type RelationToTestFunction = (
  relation: (a: any, b: any) => boolean
) => TestFunction

type TestEvaluation = (
  command: Command,
  state: State
) => Either<string, boolean>

const alwaysRight: RelationToTestFunction = relation => (
  leftOperand,
  rightOperand
) => right(relation(leftOperand, rightOperand))

const alwaysLeft: (errorMessage: string) => TestFunction = errorMessage => () =>
  left(errorMessage)

const operandMustBeANumber: (position: string) => string = position =>
  `${position} operand of the test must be a number`

const operandsMustBeNumber: RelationToTestFunction = relation => (
  leftOperand,
  rightOperand
) =>
  !isNumber(leftOperand)
    ? left(operandMustBeANumber('left'))
    : !isNumber(rightOperand)
    ? left(operandMustBeANumber('right'))
    : right(relation(leftOperand, rightOperand))

const getTestFunction: (operator: string) => TestFunction = operator =>
  R.cond<string, TestFunction>([
    [R.equals('equals'), () => alwaysRight(R.equals)],
    [R.equals('lte'), () => operandsMustBeNumber(R.lte)],
    [R.T, () => alwaysLeft(`Operator ${operator} is not valid`)],
  ])(operator)

// TODO Control errors on expressions
const evaluateTest: TestEvaluation = ({ args }, state) => {
  const [leftExpressionAndOperator, valAndRightExpression] = splitArgsByVal(
    args
  )
  const leftExpression = R.pipe(
    R.dropLast(1),
    parseExpression(state),
    decodeExpression
  )(leftExpressionAndOperator)
  const operator = R.last(leftExpressionAndOperator) || 'missing operator'
  const rightExpression = R.pipe(
    parseExpression(state),
    decodeExpression
  )(valAndRightExpression)

  return getTestFunction(operator)(leftExpression, rightExpression)
}

const storeTestResult = (testResult: boolean) =>
  R.assoc('testResult', testResult)

const test: TestCommandAndUpdateState = [
  R.propEq('instruction', 'test'),
  command => state => {
    const testEvaluation = evaluateTest(command, state)
    return isRight(testEvaluation)
      ? right(storeTestResult(testEvaluation.right)(state))
      : left(testEvaluation.left)
  },
]

export default test
