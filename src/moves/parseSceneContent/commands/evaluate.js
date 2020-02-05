import * as R from 'ramda'
import getPlayedSceneCount from '../../stateHelpers/playedSceneCount'

// State -> [[String] -> Boolean, [String] -> String]
const playedCount = state => [
  R.pipe(R.head, R.equals('playedCount')),
  R.pipe(R.always(getPlayedSceneCount(state)), R.toString),
]

// [[String] -> Boolean, [String] -> String]
const rollDices = [R.pipe(R.head, R.equals('roll')), R.always(3)]

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

// State -> [[String] -> Boolean, [String] -> String]
const getValue = state => [hasPathTo(state), pathTo(state)]

// State -> [String] -> String
const evaluate = state =>
  R.cond([
    playedCount(state),
    rollDices,
    getValue(state),
    [R.T, R.pipe(R.join(' '), R.concat('Error in expression : '))],
  ])

export default evaluate
