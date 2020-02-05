import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'

// State -> [[String] -> Boolean, [String] -> String]
const playedCount = state => [
  R.pipe(R.head, R.equals('playedCount')),
  R.pipe(R.always(getPlayedSceneCount(state)), R.toString),
]

export default playedCount
