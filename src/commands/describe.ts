import * as R from 'ramda'
import parseExpression, { ExpressionValidResult } from '../expressions'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../moves'
import { SingleASTNode } from 'simple-markdown'
import { right, Either } from 'fp-ts/lib/Either'
import { toArrayOfStrings } from '../utils/typeCheck'
import foldError from '../utils/foldError'

const getContentList: (
  state: State
) => (
  content: SingleASTNode[][],
  parsedExpressions?: ExpressionValidResult[]
) => Either<string, ExpressionValidResult[]> = state => (
  content,
  parsedExpressions = []
) => {
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
    parsedExpression =>
      getContentList(state)(restOfContent, [
        ...parsedExpressions,
        parsedExpression,
      ])
  )(mayBeParsedExpression)
}

export const getDescription: (
  state: State
) => (data: SingleASTNode[]) => Either<string, object> = state => data => {
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

  return foldError<ExpressionValidResult[], object>(
    (headerContent: ExpressionValidResult[]) =>
      foldError<ExpressionValidResult[], object>(
        (cellsContent: ExpressionValidResult[]) =>
          right(R.zipObj(toArrayOfStrings(headerContent), cellsContent))
      )(mayBeCellsContent)
  )(mayBeHeaderContent)
}

const getDescriptionKey: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('Need a key for this description'))
)

const updateStateWithDescription: CommandUpdateState = ({
  args,
  data,
}) => state =>
  foldError<object, State>((description: object) =>
    right(R.assoc(getDescriptionKey(args), description)(state))
  )(getDescription(state)(data))

const describe: TestCommandAndUpdateState = [
  R.propEq('instruction', 'describe'),
  updateStateWithDescription,
]

export default describe
