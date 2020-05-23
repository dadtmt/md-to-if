import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'
import { State } from '../../..'

// State -> [[String] -> Boolean, [String] -> String]
const playedCount: (
  state: State
) => [
  (expression: string[]) => boolean,
  (expression: string[]) => number
] = state => [
  R.pipe(R.head, R.equals('playedCount')),
  R.always(getPlayedSceneCount(state)),
]

export default playedCount
