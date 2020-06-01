import * as R from 'ramda'

import parseExpression from './expressions'
import { State } from '../..'
import { TestCommandAndGetContent } from '.'

const show: (state: State) => TestCommandAndGetContent = state => [
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
