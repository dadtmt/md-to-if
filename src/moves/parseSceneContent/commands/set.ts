import * as R from 'ramda'

import parseExpression from './expressions'
import { Command } from '.'
import { State } from '../..'

const assocToState: (
  path: string[],
  expression: string[],
  state: State
) => State = (path, expression, state) =>
  R.assocPath<string | number, State>(
    path,
    parseExpression(state)(R.tail(expression))
  )(state)

// [String] -> State -> State
const setValue: (args: string[]) => (state: State) => State = args => state => {
  const [path, expression] = R.splitWhen(R.equals('val'), args)
  return assocToState(path, expression, state)
}

// [Command -> Boolean, Command -> State -> State]
const set: [
  (command: Command) => boolean,
  (command: Command) => (state: State) => State
] = [R.propEq('instruction', 'set'), ({ args }) => setValue(args)]

export default set
