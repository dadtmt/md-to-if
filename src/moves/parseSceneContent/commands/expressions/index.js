import * as R from 'ramda'

import rollDices from './rollDices'
import getValue from './getValue'
import playedCount from './playedCount'

// State -> [String] -> String
const parseExpression = state =>
  R.cond([
    playedCount(state),
    rollDices,
    getValue(state),
    [R.T, R.pipe(R.join(' '), R.concat('Error in expression : '))],
  ])

export default parseExpression
