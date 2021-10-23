import * as R from 'ramda'

import parseExpression, { ExpressionValidResult } from '../expressions'
import { TestCommandAndUpdateState } from '.'
import { splitArgsByVal } from './helpers'
import { State } from '../moves'
import { right, left } from 'fp-ts/lib/Either'
import foldError from '../utils/foldError'

const set: TestCommandAndUpdateState = [
  R.propEq('instruction', 'set'),
  ({ args }) =>
    (state) => {
      const [path, expression] = splitArgsByVal(args)
      return R.isEmpty(path)
        ? left('path is required to set a value -- path val value')
        : foldError((expressionValidResult: ExpressionValidResult) =>
            R.pipe(
              R.assocPath<ExpressionValidResult, State>(
                ['store', ...path],
                expressionValidResult
              ),
              right
            )(state)
          )(parseExpression(state)(expression))
    }
]

export default set
