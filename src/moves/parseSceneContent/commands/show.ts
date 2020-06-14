import * as R from 'ramda'

import { State } from '../..'
import { TestCommandAndGetContent, resolveExpression } from '.'

// TODO Control errors on expressions

const show: (state: State) => TestCommandAndGetContent = state => [
  R.propEq('instruction', 'show'),
  ({ args }) => ({
    content: R.pipe(
      resolveExpression(state),
      R.when(R.pipe(R.is(String), R.not), R.toString)
    )(args),
    type: 'text',
  }),
]

export default show
