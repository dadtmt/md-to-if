import * as R from 'ramda'

import parseExpression, { Expression, ParsedExpression } from './expressions'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../..'
import { right, left } from 'fp-ts/lib/Either'

const assocToState: (
  path: string[],
  expression: Expression,
  state: State
) => State = (path, expression, state) =>
  R.assocPath<ParsedExpression, State>(
    path,
    parseExpression(state)(R.tail(expression))
  )(state)

const setValue: CommandUpdateState = ({ args }) => state => {
  const [path, expression] = R.splitWhen(R.equals('val'), args)
  return R.isEmpty(path)
    ? left('path is required to set a value -- path val value')
    : right(assocToState(path, expression, state))
}

// [Command -> Boolean, Command -> State -> State]
const set: TestCommandAndUpdateState = [
  R.propEq('instruction', 'set'),
  setValue,
]

export default set
