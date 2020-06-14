import * as R from 'ramda'

import getPlayedSceneCount from '../../../stateHelpers/playedSceneCount'
import { State } from '../../..'
import { TestAndParseExpression, isFirstWord } from '.'
import { right } from 'fp-ts/lib/Either'

const playedCount: (state: State) => TestAndParseExpression = state => [
  isFirstWord('playedCount'),
  R.always(right(getPlayedSceneCount(state))),
]

export default playedCount
