import * as R from 'ramda'

import parseExpression from './expressions'
import { State } from '../..'
import { Command } from '.'
import { Content } from '..'

// State -> [Command -> Boolean, Command -> Content]
const show: (
  state: State
) => [(command: Command) => boolean, (command: Command) => Content] = state => [
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
