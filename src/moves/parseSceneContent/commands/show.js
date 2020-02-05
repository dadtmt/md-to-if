import * as R from 'ramda'

import parseExpression from './expressions'

// State -> [Command -> Boolean, Command -> Content]
const show = state => [
  R.propEq('instruction', 'show'),
  ({ args }) => ({
    content: parseExpression(state)(args),
    type: 'text',
  }),
]

export default show
