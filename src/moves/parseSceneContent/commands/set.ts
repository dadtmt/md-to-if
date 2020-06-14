import * as R from 'ramda'

import parseExpression, { Expression } from './expressions'
import {
  TestCommandAndUpdateState,
  CommandUpdateState,
  decodeExpression,
  splitArgsByVal,
} from '.'
import { State } from '../..'
import { right, left } from 'fp-ts/lib/Either'

const assocToState: (
  path: string[],
  expression: Expression,
  state: State
) => State = (path, expression, state) =>
  R.assocPath<string | number, State>(
    path,
    R.pipe(parseExpression(state), decodeExpression)(expression)
  )(state)

const setValue: CommandUpdateState = ({ args }) => state => {
  const [path, expression] = splitArgsByVal(args)
  return R.isEmpty(path)
    ? left('path is required to set a value -- path val value')
    : right(assocToState(path, expression, state))
}

const set: TestCommandAndUpdateState = [
  R.propEq('instruction', 'set'),
  setValue,
]

export default set
