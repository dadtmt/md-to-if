import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'

// State -> [[String] -> Boolean, [String] -> String]
const playedCount = state => [
  R.pipe(R.head, R.equals('playedCount')),
  R.always(getPlayedSceneCount(state)),
]

export default playedCount
