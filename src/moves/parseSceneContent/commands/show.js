import * as R from 'ramda'

import parseExpression from './expressions'

// State -> [Command -> Boolean, Command -> Content]
const show = state => [
  R.propEq('instruction', 'show'),
  ({ args }) => ({
    content: R.pipe(
      parseExpression(state),
      R.when(R.pipe(R.is(String), R.not), R.toString)
    )(args),
    type: 'text',
  }),
]

export default show
