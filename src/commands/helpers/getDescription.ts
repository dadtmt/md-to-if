import { Either, right } from 'fp-ts/lib/Either'
import R from 'ramda'
import { SingleASTNode } from 'simple-markdown'
import parseExpression, { ExpressionValidResult } from '../../expressions'
import { State } from '../../moves'
import foldError from '../../utils/foldError'
import { toArrayOfStrings } from '../../utils/typeCheck'
import { Description } from '../describe'

const getContentList: (
  state: State
) => (
  content: SingleASTNode[][],
  parsedExpressions?: ExpressionValidResult[]
) => Either<string, ExpressionValidResult[]> =
  (state) =>
  (content, parsedExpressions = []) => {
    const [headOfContent, ...restOfContent] = content
    if (R.isNil(headOfContent)) {
      return right(parsedExpressions)
    }
    const mayBeParsedExpression = R.pipe(
      R.head,
      R.propOr('', 'content'),
      R.split(' '),
      parseExpression(state)
    )(headOfContent)

    return foldError<ExpressionValidResult, ExpressionValidResult[]>(
      (parsedExpression) =>
        getContentList(state)(restOfContent, [
          ...parsedExpressions,
          parsedExpression
        ])
    )(mayBeParsedExpression)
  }

const getDescription: (
  state: State
) => (data: SingleASTNode[]) => Either<string, Description> =
  (state) => (data) => {
    const headerDataLens = R.lensPath([0, 'header'])
    const cellsDataLens = R.lensPath([0, 'cells', 0])
    const mayBeHeaderContent = R.pipe(
      R.view(headerDataLens),
      getContentList(state)
    )(data)
    const mayBeCellsContent = R.pipe(
      R.view(cellsDataLens),
      getContentList(state)
    )(data)

    return foldError<ExpressionValidResult[], Description>(
      (headerContent: ExpressionValidResult[]) =>
        foldError<ExpressionValidResult[], Description>(
          (cellsContent: ExpressionValidResult[]) =>
            right(R.zipObj(toArrayOfStrings(headerContent), cellsContent))
        )(mayBeCellsContent)
    )(mayBeHeaderContent)
  }

export default getDescription
