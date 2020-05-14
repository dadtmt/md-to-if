import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'

type State = {
  currentSceneName?: string ;
  played?: { currentSceneName: number } ; 
  path?: { to: { the: string } } ;
}

// State -> [[String] -> Boolean, [String] -> String]
const playedCount: (
  state: State
) => [
  (expression: string[]) => boolean,
  (expression: string[]) => string
] = state => [
  R.pipe(R.head, R.equals('playedCount')),
  R.always(getPlayedSceneCount(state)),
]

export default playedCount
