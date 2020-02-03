import * as R from 'ramda'

import evaluate from './evaluate'

// State -> [Command -> Boolean, Command -> Content]
const show = state => [
  R.propEq('instruction', 'show'),
  ({ args }) => ({
    content: evaluate(state)(args),
    type: 'text',
  }),
]

export default show
