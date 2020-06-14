import * as R from 'ramda'

import parseExpression, { ParsedExpression, Expression } from './expressions'
import { TestCommandAndUpdateState, Command } from '.'
import { State } from '../..'
import { right, Either, isRight, left } from 'fp-ts/lib/Either'

type TestFunction = (
  leftOperand: ParsedExpression,
  rightOperand: ParsedExpression
) => Either<string, boolean>

type RelationToTestFunction = (
  relation: (a: any, b: any) => boolean
) => TestFunction

type TestEvaluation = (
  command: Command,
  state: State
) => Either<string, boolean>

function isNumber(x: any): x is number {
  return typeof x === 'number'
}

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
