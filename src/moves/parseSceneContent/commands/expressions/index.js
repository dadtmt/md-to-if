import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'

// State -> [String] -> String
const parseExpression = state =>
  R.cond([playedCount(state), rollDices, getValue(state), [R.T, R.head]])

export default parseExpression
