import * as R from 'ramda'

import getPlayedSceneCount from '../../stateHelpers/playedSceneCount'

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

// State -> Command -> String
const getStringToShow = state =>
  R.pipe(
    R.ifElse(
      R.pipe(R.prop('args'), R.head, R.equals('playedCount')),
      R.always(R.pipe(getPlayedSceneCount, R.toString)(state)),
      R.pipe(R.prop('args'), pathTo(state))
    )
  )

// State -> [Command -> Boolean, Command -> Content]
const show = state => [
  R.propEq('instruction', 'show'),
  command => ({
    content: getStringToShow(state)(command),
    type: 'text',
  }),
]

export default show
