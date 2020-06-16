import * as R from 'ramda'

import { Expression } from '../expressions'
import {
  TestCommandAndUpdateState,
  CommandUpdateState,
  splitArgsByVal,
  resolveExpression,
} from '.'
import { State } from '../moves'
import { right, left } from 'fp-ts/lib/Either'

const assocToState: (
  path: string[],
  expression: Expression,
  state: State
) => State = (path, expression, state) =>
  R.assocPath<string | number, State>(
    path,
    resolveExpression(state)(expression)
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
