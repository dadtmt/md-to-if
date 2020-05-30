import * as R from 'ramda'

import parseExpression, { Expression, ParsedExpression } from './expressions'
import { TestCommandAndUpdateState } from '.'
import { State } from '../..'

const assocToState: (
  path: string[],
  expression: Expression,
  state: State
) => State = (path, expression, state) =>
  R.assocPath<ParsedExpression, State>(
    path,
    parseExpression(state)(R.tail(expression))
  )(state)

// [String] -> State -> State
const setValue: (args: string[]) => (state: State) => State = args => state => {
  const [path, expression] = R.splitWhen(R.equals('val'), args)
  return assocToState(path, expression, state)
}

// [Command -> Boolean, Command -> State -> State]
const set: TestCommandAndUpdateState = [
  R.propEq('instruction', 'set'),
  ({ args }) => setValue(args),
]

export default set
