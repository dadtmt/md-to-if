import * as R from 'ramda'

import getPlayedSceneCount from '../stateHelpers/playedSceneCount'

const getRightExpression = R.last

const getTestOperator = R.pipe(R.dropLast(1), R.last)

const getTestFunction = test => {
  if (getTestOperator(test) === 'equals') {
    return R.equals
  } else {
    return R.always('illegal-operator')
  }
}

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

const evaluateTest = state => test => {
  return R.converge(getTestFunction(test), [
    evaluateLeftExpression(state),
    getRightExpression,
  ])(test)
}

export default evaluateTest
