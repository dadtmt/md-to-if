import * as R from 'ramda'

import { State } from '../moves'
import { TestCommandAndGetContent } from '.'
import { toStringIfNotString } from '../utils/typeCheck'
import parseExpression, { ExpressionValidResult } from '../expressions'
import { left, right, fold, Either } from 'fp-ts/lib/Either'
import { SingleASTNode } from 'simple-markdown'
import { textNode } from '../node'

const contentToShow: (
  text: ExpressionValidResult
) => Either<string, SingleASTNode> = (text) =>
  right(textNode(toStringIfNotString(text)))

const errorMessage: (message: string) => Either<string, SingleASTNode> = (
  message
) => left(message)

const show = (state: State): TestCommandAndGetContent => {
  return [
    R.propEq('instruction', 'show'),
    ({ args }) =>
      fold(errorMessage, contentToShow)(parseExpression(state)(args))
  ]
}

export default show
