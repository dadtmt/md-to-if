import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'
import { State } from '../../..'
import { ConditionalFunction } from '../..'

export type Expression = string[]

export type ParsedExpression = string | number

type TestExpression = ConditionalFunction<Expression>

type ParseExpression = (expression: Expression) => ParsedExpression

export type TestAndParseExpression = [TestExpression, ParseExpression]

export const isFirstWord: (word: string) => TestExpression = word =>
  R.pipe(R.head, R.equals(word))

const wordMayBeANumber: (word: string) => ParsedExpression = word => {
  const convertedString = parseInt(word)
  return !isNaN(convertedString) ? convertedString : word
}

const firstWordOrNumberByDefault: TestAndParseExpression = [
  R.T,
  R.pipe(R.head, wordMayBeANumber),
]

// State -> [String] -> String
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
