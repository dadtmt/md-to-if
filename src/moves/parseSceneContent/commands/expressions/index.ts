import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'

const stringOrInt = str => {
  const convertedString = parseInt(str)
  return !isNaN(convertedString) ? convertedString : str
}

// State -> [String] -> String
const parseExpression = state =>
  R.cond([
    playedCount(state),
    rollDices,
    getValue(state),
    [R.T, R.pipe(R.head, stringOrInt)],
  ])

export default parseExpression
