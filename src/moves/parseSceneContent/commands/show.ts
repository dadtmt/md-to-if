import * as R from 'ramda'

import parseExpression from './expressions'
import { State } from '../..'
import { TestCommandAndGetContent, decodeExpression } from '.'

// TODO Control errors on expressions

const show: (state: State) => TestCommandAndGetContent = state => [
  R.propEq('instruction', 'show'),
  ({ args }) => ({
    content: R.pipe(
      parseExpression(state),
      decodeExpression,
      R.when(R.pipe(R.is(String), R.not), R.toString)
    )(args),
    type: 'text',
  }),
]

export default show
