import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'
import { State } from '../moves'
import { ConditionalFunction } from '../parseSceneContent'
import { Either, right, left } from 'fp-ts/lib/Either'

export type Expression = string[]

export type ExpressionValidResult = string | number

export type ParsedExpression = Either<string, ExpressionValidResult>

type TestExpression = ConditionalFunction<Expression>

type ParseExpression = (expression: Expression) => ParsedExpression

export type TestAndParseExpression = [TestExpression, ParseExpression]

export const isFirstWord: (word: string) => TestExpression = word =>
  R.pipe(R.head, R.equals(word))

const wordMayBeANumber: (word: string) => ParsedExpression = word => {
  const convertedString = parseInt(word)
  return right(!isNaN(convertedString) ? convertedString : word)
}

const firstWordOrNumberByDefault: TestAndParseExpression = [
  R.T,
  R.pipe(R.head, wordMayBeANumber),
]

const makeExpressionError: TestAndParseExpression = [
  isFirstWord('error'),
  R.always(left('Error parsing an expression')),
]

const parseExpression: (
  state: State
) => (expression: Expression) => ParsedExpression = state =>
  R.cond([
    playedCount(state),
    rollDices,
    getValue(state),
    makeExpressionError,
    firstWordOrNumberByDefault,
  ])

export default parseExpression
