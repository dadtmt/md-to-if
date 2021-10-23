import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'
import { State } from '../moves'
import { ConditionalFunction } from '../parseSceneContent/parseContent'
import { Either, right, left } from 'fp-ts/lib/Either'
import evaluate from './evaluate'
export type Expression = string[]

export type ExpressionValidResult = string | number | boolean

export type ParsedExpression = Either<string, ExpressionValidResult>

type TestExpression = ConditionalFunction<Expression>

type ParseExpression = (expression: Expression) => ParsedExpression

export type TestAndParseExpression = [TestExpression, ParseExpression]

export const isFirstWord: (word: string) => TestExpression = (word) =>
  R.pipe(R.head, R.equals(word))

const wordMayBeANumberOrABoolean: (word: string) => ParsedExpression = (
  word
) => {
  if (word === 'true') {
    return right(true)
  }
  if (word === 'false') {
    return right(false)
  }
  const convertedString = parseInt(word)
  return right(!isNaN(convertedString) ? convertedString : word)
}

const firstWordOrNumberByDefault: TestAndParseExpression = [
  R.T,
  R.pipe(R.head, wordMayBeANumberOrABoolean)
]

const makeExpressionError: TestAndParseExpression = [
  isFirstWord('error'),
  R.always(left('Error parsing an expression'))
]

const parseExpression: (
  state: State
) => (expression: Expression) => ParsedExpression = (state) =>
  R.cond([
    playedCount(state),
    rollDices,
    evaluate(state),
    getValue(state),
    makeExpressionError,
    firstWordOrNumberByDefault
  ])

export default parseExpression
