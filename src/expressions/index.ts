import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'
import { State } from '../moves'
import { ConditionalFunction } from '../moves/parseSceneContent'
import { Either, right } from 'fp-ts/lib/Either'

export type Expression = string[]

export type ParsedExpression = Either<string, string | number>

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

const parseExpression: (
  state: State
) => (expression: Expression) => ParsedExpression = state =>
  R.cond([
    playedCount(state),
    rollDices,
    getValue(state),
    firstWordOrNumberByDefault,
  ])

export default parseExpression
