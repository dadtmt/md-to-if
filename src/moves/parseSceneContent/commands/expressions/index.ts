import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'
import { State } from '../../..'

const toNumber: (str: string) => string | number = str => {
  const convertedString = parseInt(str)
  return !isNaN(convertedString) ? convertedString : str
}

const byDefault: [
  (expression: string[]) => boolean,
  (expression: string[]) => string | number
] = [R.T, R.pipe(R.head, toNumber)]

// State -> [String] -> String
const parseExpression: (
  state: State
) => (expression: string[]) => string | number = state =>
  R.cond([playedCount(state), rollDices, getValue(state), byDefault])

export default parseExpression
