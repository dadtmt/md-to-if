import * as R from 'ramda'

import {
  TestCommandAndUpdateState,
  Command,
  splitArgsByVal,
  resolveExpression,
} from '.'
import { State } from '../moves'
import { right, Either, isRight, left } from 'fp-ts/lib/Either'
import { isNumber } from '../typeGuards'

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

const splitLeftPart: (
  expressionAndOperator: string[]
) => [string, string[]] = expressionAndOperator => [
  R.last(expressionAndOperator) || 'missing-operator',
  R.dropLast<string>(1)(expressionAndOperator),
]

// TODO Control errors on expressions
const evaluateTest: TestEvaluation = ({ args }, state) => {
  const [leftPartAndOperator, rightPart] = splitArgsByVal(args)
  const [operator, leftPart] = splitLeftPart(leftPartAndOperator)

  return getTestFunction(operator)(
    resolveExpression(state)(leftPart),
    resolveExpression(state)(rightPart)
  )
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
