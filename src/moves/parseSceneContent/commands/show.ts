import * as R from 'ramda'

import { State } from '../..'
import { TestCommandAndGetContent } from '.'
import { toStringIfNotString } from '../../../utils/typeCheck'
import parseExpression, { Expression, ParsedExpression } from './expressions'
import { isRight, left, right } from 'fp-ts/lib/Either'

const show: (state: State) => TestCommandAndGetContent = state => {
  return [
    R.propEq('instruction', 'show'),
    ({ args }) => {
      const mayBeContent = parseExpression(state)(args)
      return isRight(mayBeContent)
        ? right({
            content: toStringIfNotString(mayBeContent.right),
            type: 'text',
          })
        : left(mayBeContent.left)
    },
  ]
}

export default show
