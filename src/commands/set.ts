import * as R from 'ramda'

import parseExpression, {
  Expression,
  ExpressionValidResult,
} from '../expressions'
import {
  TestCommandAndUpdateState,
  CommandUpdateState,
  splitArgsByVal,
  Command,
} from '.'
import { State } from '../moves'
import { right, left, Either } from 'fp-ts/lib/Either'
import foldError from '../utils/foldError'

const set: TestCommandAndUpdateState = [
  R.propEq('instruction', 'set'),
  ({ args }) => state => {
    const [path, expression] = splitArgsByVal(args)
    return R.isEmpty(path)
      ? left('path is required to set a value -- path val value')
      : foldError((expressionValidResult: ExpressionValidResult) =>
          R.pipe(
            R.assocPath<ExpressionValidResult, State>(
              path,
              expressionValidResult
            ),
            right
          )(state)
        )(parseExpression(state)(expression))
  },
]

export default set
