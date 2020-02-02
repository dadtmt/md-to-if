import * as R from 'ramda'

import getPlayedSceneCount from '../../stateHelpers/playedSceneCount'

// [String] -> String
const getTestOperator = R.pipe(R.dropLast(1), R.last)

// [String] -> String -> String -> Boolean|ErrorString
const getTestFunction = args => {
  if (getTestOperator(args) === 'equals') {
    return R.equals
  } else {
    return R.always('illegal-operator')
  }
}

// State -> [String] -> String
const evaluateLeftExpression = state => {
  return R.pipe(
    R.dropLast(2),
    R.when(
      R.last,
      R.equals('playedCount'),
      R.always(getPlayedSceneCount(state))
    ),
    R.toString
  )
}

// [String] -> String
const getRightExpression = R.last

// [String], State -> Boolean
const evaluateTest = (args, state) =>
  R.converge(getTestFunction(args), [
    evaluateLeftExpression(state),
    getRightExpression,
  ])(args)

// Command -> State -> State
const test = ({ args }) => state =>
  R.assoc('testResult', evaluateTest(args, state))(state)

export default test
