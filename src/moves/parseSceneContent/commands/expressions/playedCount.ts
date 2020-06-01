import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'
import { State } from '../../..'
import { TestAndParseExpression, Expression, isFirstWord } from '.'

const playedCount: (state: State) => TestAndParseExpression = state => [
  isFirstWord('playedCount'),
  R.always(getPlayedSceneCount(state)),
]

export default playedCount
